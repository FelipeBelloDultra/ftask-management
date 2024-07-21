import { Either, left, right } from "~/core/either";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { ProjectMemberRepository } from "~/project/application/repositories/project-member.repository";
import { ProjectRepository } from "~/project/application/repositories/project.repository";
import { TaskRepository } from "~/project/application/repositories/task.repository";
import { Task } from "~/project/domain/entity/task";
import { DueDate } from "~/project/domain/entity/value-objects/due-date";

import { AccountNotFoundError } from "./errors/account-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";
import { ProjectMemberNotFoundError } from "./errors/project-member-not-found.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";

type Input = {
  dueDate: Date;
  assigneeId: string;
  projectId: string;
  description: string;
  title: string;
  ownerAccountId: string;
};
type OnError = AccountNotFoundError | ProjectNotFoundError | NotAllowedError | ProjectMemberNotFoundError;
type OnSuccess = { task: Task };
type Output = Either<OnError, OnSuccess>;

export class CreateTaskUseCase {
  public constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly projectMemberRepository: ProjectMemberRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const project = await this.projectRepository.findById(UniqueEntityID.create(input.projectId));
    if (!project) {
      return left(new ProjectNotFoundError());
    }

    const ownerAccountId = UniqueEntityID.create(input.ownerAccountId);
    if (!project.values.ownerId.equals(ownerAccountId)) {
      return left(new NotAllowedError());
    }

    const projectMember = await this.projectMemberRepository.findByMemberAndProjectId(
      UniqueEntityID.create(input.assigneeId),
      project.id,
    );
    if (!projectMember) {
      return left(new ProjectMemberNotFoundError());
    }

    const task = Task.create({
      assigneeId: projectMember.memberId,
      description: input.description,
      dueDate: DueDate.create(input.dueDate),
      projectId: project.id,
      title: input.title,
    });

    await this.taskRepository.create(task);

    return right({ task });
  }
}

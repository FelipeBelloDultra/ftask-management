import { inject, injectable } from "tsyringe";

import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ProjectMemberRepository } from "@/modules/project/application/repositories/project-member.repository";
import { ProjectRepository } from "@/modules/project/application/repositories/project.repository";
import { TaskRepository } from "@/modules/project/application/repositories/task.repository";
import { Task } from "@/modules/project/domain/entity/task";
import { DueDate } from "@/modules/project/domain/entity/value-objects/due-date";

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
type OnError = ProjectNotFoundError | NotAllowedError | ProjectMemberNotFoundError;
type OnSuccess = { task: Task };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class CreateTaskUseCase {
  public constructor(
    @inject("TaskRepository")
    private readonly taskRepository: TaskRepository,
    @inject("ProjectRepository")
    private readonly projectRepository: ProjectRepository,
    @inject("ProjectMemberRepository")
    private readonly projectMemberRepository: ProjectMemberRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const project = await this.projectRepository.findById(UniqueEntityID.create(input.projectId));
    if (!project) {
      return left(new ProjectNotFoundError());
    }

    const ownerAccountId = UniqueEntityID.create(input.ownerAccountId);
    if (!project.ownerId.equals(ownerAccountId)) {
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

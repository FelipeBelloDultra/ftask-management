import { left, right } from "~/core/either";
import { Task } from "~/project/domain/entity/task";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { DueDate } from "~/project/domain/entity/value-objects/due-date";

import { AccountNotFoundError } from "./errors/account-not-found.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";
import { ProjectMemberNotFoundError } from "./errors/project-member-not-found.error";

import type { TaskRepository } from "~/project/application/repositories/task.repository";
import type { ProjectRepository } from "~/project/application/repositories/project.repository";
import type { MemberRepository } from "~/account/application/repositories/member.repository";
import type { OwnerRepository } from "~/account/application/repositories/owner.repository";
import type { Either } from "~/core/either";

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
    private readonly ownerRepository: OwnerRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const owner = await this.ownerRepository.findByAccountId(UniqueEntityID.create(input.ownerAccountId));
    if (!owner) {
      return left(new AccountNotFoundError());
    }

    const project = await this.projectRepository.findById(UniqueEntityID.create(input.projectId));
    if (!project) {
      return left(new ProjectNotFoundError());
    }

    if (!project.values.ownerId.equals(owner.id)) {
      return left(new NotAllowedError());
    }

    const member = await this.memberRepository.findById(UniqueEntityID.create(input.assigneeId));
    if (!member || !member.values.projectId.equals(project.id)) {
      return left(new ProjectMemberNotFoundError());
    }

    const task = Task.create({
      assigneeId: member.id,
      description: input.description,
      dueDate: DueDate.create(input.dueDate),
      projectId: project.id,
      title: input.title,
    });

    await this.taskRepository.create(task);

    return right({ task });
  }
}
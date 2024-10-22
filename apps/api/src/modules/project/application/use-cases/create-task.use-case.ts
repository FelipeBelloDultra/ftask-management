import { inject, injectable } from "tsyringe";

import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { MemberRepository } from "@/modules/account/application/repositories/member.repository";
import { ProjectRepository } from "@/modules/project/application/repositories/project.repository";
import { TaskRepository } from "@/modules/project/application/repositories/task.repository";
import { Task } from "@/modules/project/domain/entity/task";
import { DueDate } from "@/modules/project/domain/entity/value-objects/due-date";

import { CreateTaskDto } from "../dtos/create-task-dto";
import { InviteRepository } from "../repositories/invite.repository";

import { NotAllowedError } from "./errors/not-allowed.error";
import { ProjectMemberNotFoundError } from "./errors/project-member-not-found.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";

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
    @inject("InviteRepository")
    private readonly inviteRepository: InviteRepository,
    @inject("MemberRepository")
    private readonly memberRepository: MemberRepository,
  ) {}

  public async execute(input: CreateTaskDto): Promise<Output> {
    const projectId = UniqueEntityID.create(input.projectId);
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      return left(new ProjectNotFoundError());
    }

    const ownerAccountId = UniqueEntityID.create(input.ownerAccountId);
    if (!project.isOwner(ownerAccountId)) {
      return left(new NotAllowedError());
    }

    const assigneeId = UniqueEntityID.create(input.assigneeId);
    const member = await this.memberRepository.findByAccountAndProjectId(assigneeId, project.id);
    if (!member) {
      return left(new ProjectMemberNotFoundError());
    }

    const invite = await this.inviteRepository.findLastByMemberId(member.id);
    if (!invite || invite.status.isBlocked()) {
      return left(new NotAllowedError());
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

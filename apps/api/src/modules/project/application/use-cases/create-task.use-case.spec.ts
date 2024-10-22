import { makeAccount } from "@/test/factories/make-account";
import { makeInvite } from "@/test/factories/make-invite";
import { makeMember } from "@/test/factories/make-member";
import { makeProject } from "@/test/factories/make-project";
import { InMemoryInviteRepository } from "@/test/repositories/in-memory-invite.repository";
import { InMemoryMemberRepository } from "@/test/repositories/in-memory-member.repository";
import { InMemoryProjectRepository } from "@/test/repositories/in-memory-project.repository";
import { InMemoryTaskRepository } from "@/test/repositories/in-memory-task.repository";

import { CreateTaskDto } from "../dtos/create-task-dto";

import { CreateTaskUseCase } from "./create-task.use-case";
import { NotAllowedError } from "./errors/not-allowed.error";
import { ProjectMemberNotFoundError } from "./errors/project-member-not-found.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";

describe("CreateTaskUseCase", () => {
  let sut: CreateTaskUseCase;
  let inMemoryProjectRepository: InMemoryProjectRepository;
  let inMemoryInviteRepository: InMemoryInviteRepository;
  let inMemoryTaskRepository: InMemoryTaskRepository;
  let inMemoryMemberRepository: InMemoryMemberRepository;

  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository();
    inMemoryProjectRepository = new InMemoryProjectRepository();
    inMemoryInviteRepository = new InMemoryInviteRepository();
    inMemoryMemberRepository = new InMemoryMemberRepository();

    sut = new CreateTaskUseCase(
      inMemoryTaskRepository,
      inMemoryProjectRepository,
      inMemoryInviteRepository,
      inMemoryMemberRepository,
    );
  });

  it("should be able to create a new task", async () => {
    const account = makeAccount();
    const project = makeProject({
      ownerId: account.id,
    });
    const member = makeMember({
      accountId: account.id,
      projectId: project.id,
    });
    const invite = makeInvite({
      memberId: member.id,
      projectId: project.id,
    });
    invite.status.setAccepted();

    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryMemberRepository.create(member),
      inMemoryInviteRepository.create(invite),
    ]);

    const input = CreateTaskDto.create({
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
      assigneeId: account.id.toValue(),
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    });

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryTaskRepository.tasks.length).toBe(1);
  });

  it("should not be able to create a new task with no project", async () => {
    const account = makeAccount();

    const input = CreateTaskDto.create({
      ownerAccountId: account.id.toValue(),
      projectId: "invalid-project-id",
      assigneeId: "assignee-id",
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should not be able to create a new task if the owner account id does not match the project owner account id", async () => {
    const account = makeAccount();
    const project = makeProject();

    await Promise.all([inMemoryProjectRepository.create(project)]);

    const input = CreateTaskDto.create({
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
      assigneeId: "member-id",
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to assign a member to task if the member does not exist or isn't from this specific project", async () => {
    const account = makeAccount();
    const project = makeProject({
      ownerId: account.id,
    });
    const ownerMember = makeMember({ accountId: account.id });
    const member = makeMember();
    const invite = makeInvite({
      memberId: ownerMember.id,
      projectId: project.id,
    });

    await Promise.all([inMemoryInviteRepository.create(invite), inMemoryProjectRepository.create(project)]);

    const input = CreateTaskDto.create({
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
      assigneeId: member.id.toValue(),
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectMemberNotFoundError);
  });

  it("should not be able to create a new task if the invite does not exists", async () => {
    const account = makeAccount();
    const project = makeProject({
      ownerId: account.id,
    });
    const member = makeMember({
      accountId: account.id,
      projectId: project.id,
    });

    await Promise.all([inMemoryProjectRepository.create(project), inMemoryMemberRepository.create(member)]);

    const input = CreateTaskDto.create({
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
      assigneeId: account.id.toValue(),
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to create new task if the invite is pending yet", async () => {
    const account = makeAccount();
    const project = makeProject({
      ownerId: account.id,
    });
    const member = makeMember({
      accountId: account.id,
      projectId: project.id,
    });
    const invite = makeInvite({
      memberId: member.id,
      projectId: project.id,
    });

    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryMemberRepository.create(member),
      inMemoryInviteRepository.create(invite),
    ]);

    const input = CreateTaskDto.create({
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
      assigneeId: account.id.toValue(),
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});

import { makeAccount } from "@/test/factories/make-account";
import { makeMember } from "@/test/factories/make-member";
import { makeProject } from "@/test/factories/make-project";
import { makeMemberWithProject } from "@/test/factories/make-project-member";
import { InMemoryProjectMemberRepository } from "@/test/repositories/in-memory-project-member.repository";
import { InMemoryProjectRepository } from "@/test/repositories/in-memory-project.repository";
import { InMemoryTaskRepository } from "@/test/repositories/in-memory-task.repository";

import { CreateTaskUseCase } from "./create-task.use-case";
import { NotAllowedError } from "./errors/not-allowed.error";
import { ProjectMemberNotFoundError } from "./errors/project-member-not-found.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";

describe("CreateTaskUseCase", () => {
  let sut: CreateTaskUseCase;
  let inMemoryProjectRepository: InMemoryProjectRepository;
  let inMemoryProjectMemberRepository: InMemoryProjectMemberRepository;
  let inMemoryTaskRepository: InMemoryTaskRepository;

  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository();
    inMemoryProjectRepository = new InMemoryProjectRepository();
    inMemoryProjectMemberRepository = new InMemoryProjectMemberRepository();

    sut = new CreateTaskUseCase(inMemoryTaskRepository, inMemoryProjectRepository, inMemoryProjectMemberRepository);
  });

  it("should be able to create a new task", async () => {
    const account = makeAccount();
    const project = makeProject({
      ownerId: account.id,
    });
    const member = makeMember({
      accountId: account.id,
    });
    const projectMember = makeMemberWithProject({
      member,
      project,
    });

    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryProjectMemberRepository.create(projectMember),
    ]);

    const input = {
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
      assigneeId: member.id.toValue(),
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryTaskRepository.tasks.length).toBe(1);
  });

  it("should not be able to create a new task with no project", async () => {
    const account = makeAccount();

    const input = {
      ownerAccountId: account.id.toValue(),
      projectId: "invalid-project-id",
      assigneeId: "assignee-id",
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should not be able to create a new task if the owner account id does not match the project owner account id", async () => {
    const account = makeAccount();
    const project = makeProject();

    await Promise.all([inMemoryProjectRepository.create(project)]);

    const input = {
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
      assigneeId: "member-id",
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    };

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
    const projectMember = makeMemberWithProject({
      member: ownerMember,
      project,
    });

    await Promise.all([
      inMemoryProjectMemberRepository.create(projectMember),
      inMemoryProjectRepository.create(project),
    ]);

    const input = {
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
      assigneeId: member.id.toValue(),
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectMemberNotFoundError);
  });
});

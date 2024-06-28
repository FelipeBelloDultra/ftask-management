import { makeAccount } from "test/factories/make-account";
import { makeMember } from "test/factories/make-member";
import { makeOwner } from "test/factories/make-owner";
import { makeProject } from "test/factories/make-project";
import { FakeMemberRepository } from "test/repositories/fake-member.repository";
import { FakeOwnerRepository } from "test/repositories/fake-owner.repository";
import { FakeProjectRepository } from "test/repositories/fake-project.repository";
import { FakeTaskRepository } from "test/repositories/fake-task.repository";

import { CreateTaskUseCase } from "./create-task.use-case";
import { AccountNotFoundError } from "./errors/account-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";
import { ProjectMemberNotFoundError } from "./errors/project-member-not-found.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";

describe("CreateTaskUseCase", () => {
  let sut: CreateTaskUseCase;
  let fakeProjectRepository: FakeProjectRepository;
  let fakeMemberRepository: FakeMemberRepository;
  let fakeOwnerRepository: FakeOwnerRepository;
  let fakeTaskRepository: FakeTaskRepository;

  beforeEach(() => {
    fakeTaskRepository = new FakeTaskRepository();
    fakeProjectRepository = new FakeProjectRepository();
    fakeMemberRepository = new FakeMemberRepository();
    fakeOwnerRepository = new FakeOwnerRepository();

    sut = new CreateTaskUseCase(fakeTaskRepository, fakeOwnerRepository, fakeProjectRepository, fakeMemberRepository);
  });

  it("should be able to create a new task", async () => {
    const account = makeAccount();
    const owner = makeOwner({
      accountId: account.id,
    });
    const project = makeProject({
      ownerId: owner.id,
    });
    const member = makeMember({
      accountId: account.id,
      projectId: project.id,
    });

    await Promise.all([
      fakeProjectRepository.create(project),
      fakeMemberRepository.create(member),
      fakeOwnerRepository.create(owner),
    ]);

    const input = {
      ownerAccountId: owner.values.accountId.toValue(),
      projectId: project.id.toValue(),
      assigneeId: member.id.toValue(),
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(fakeTaskRepository.tasks.length).toBe(1);
  });

  it("should not be able to create a new task with no owner", async () => {
    const input = {
      ownerAccountId: "invalid-owner-account-id",
      projectId: "project-id",
      assigneeId: "assignee-id",
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFoundError);
  });

  it("should not be able to create a new task with no project", async () => {
    const account = makeAccount();
    const owner = makeOwner({
      accountId: account.id,
    });
    await fakeOwnerRepository.create(owner);

    const input = {
      ownerAccountId: owner.values.accountId.toValue(),
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
    const owner = makeOwner({
      accountId: account.id,
    });
    const project = makeProject();

    await Promise.all([fakeProjectRepository.create(project), fakeOwnerRepository.create(owner)]);

    const input = {
      ownerAccountId: owner.values.accountId.toValue(),
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
    const owner = makeOwner({
      accountId: account.id,
    });
    const project = makeProject({
      ownerId: owner.id,
    });
    const member = makeMember();

    await Promise.all([
      fakeMemberRepository.create(member),
      fakeProjectRepository.create(project),
      fakeOwnerRepository.create(owner),
    ]);

    const input = {
      ownerAccountId: owner.values.accountId.toValue(),
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

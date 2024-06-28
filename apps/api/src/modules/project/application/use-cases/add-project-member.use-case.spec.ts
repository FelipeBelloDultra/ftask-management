import { makeAccount } from "test/factories/make-account";
import { makeMember } from "test/factories/make-member";
import { makeOwner } from "test/factories/make-owner";
import { makeProject } from "test/factories/make-project";
import { FakeAccountRepository } from "test/repositories/fake-account.repository";
import { FakeMemberRepository } from "test/repositories/fake-member.repository";
import { FakeOwnerRepository } from "test/repositories/fake-owner.repository";
import { FakeProjectRepository } from "test/repositories/fake-project.repository";

import { AddProjectMemberUseCase } from "./add-project-member.use-case";
import { AccountNotFoundError } from "./errors/account-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";
import { OwnerCannotBeAddedAsMemberError } from "./errors/owner-cannot-be-added-as-member.error";
import { ProjectMemberAlreadyExistsError } from "./errors/project-member-already-exists.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";

describe("AddProjectMemberUseCase", () => {
  let sut: AddProjectMemberUseCase;
  let fakeProjectRepository: FakeProjectRepository;
  let fakeAccountRepository: FakeAccountRepository;
  let fakeMemberRepository: FakeMemberRepository;
  let fakeOwnerRepository: FakeOwnerRepository;

  beforeEach(() => {
    fakeProjectRepository = new FakeProjectRepository();
    fakeAccountRepository = new FakeAccountRepository();
    fakeMemberRepository = new FakeMemberRepository();
    fakeOwnerRepository = new FakeOwnerRepository();

    sut = new AddProjectMemberUseCase(
      fakeMemberRepository,
      fakeProjectRepository,
      fakeAccountRepository,
      fakeOwnerRepository,
    );
  });

  it("should be able to add a new project member", async () => {
    const account = makeAccount();
    const owner = makeOwner({
      accountId: account.id,
    });
    const project = makeProject({
      ownerId: owner.id,
    });
    await Promise.all([
      fakeOwnerRepository.create(owner),
      fakeProjectRepository.create(project),
      fakeAccountRepository.create(account),
    ]);

    const input = {
      memberAccountEmail: account.values.email,
      ownerAccountId: owner.values.accountId.toValue(),
      projectId: project.id.toValue(),
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(fakeMemberRepository.members.length).toBe(1);
  });

  it("should not be able to add project member if project does not exists", async () => {
    const input = {
      memberAccountEmail: "member-account-email",
      ownerAccountId: "owner-account-id",
      projectId: "invalid-project-id",
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should not be able to add project member if owner does not exists", async () => {
    const project = makeProject();
    await fakeProjectRepository.create(project);

    const input = {
      memberAccountEmail: "member-account-email",
      ownerAccountId: "owner-account-id",
      projectId: project.id.toValue(),
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFoundError);
  });

  it("should not be able to create a project member if owner ins't owner from this project", async () => {
    const account = makeAccount();
    const owner = makeOwner({
      accountId: account.id,
    });
    const project = makeProject();
    await Promise.all([
      fakeOwnerRepository.create(owner),
      fakeProjectRepository.create(project),
      fakeAccountRepository.create(account),
    ]);

    const input = {
      memberAccountEmail: account.values.email,
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to create a project member if member email does not exists", async () => {
    const account = makeAccount();
    const owner = makeOwner({
      accountId: account.id,
    });
    const project = makeProject({
      ownerId: owner.id,
    });
    await Promise.all([
      fakeOwnerRepository.create(owner),
      fakeProjectRepository.create(project),
      fakeAccountRepository.create(account),
    ]);

    const input = {
      memberAccountEmail: "invalid-member-account-email",
      ownerAccountId: owner.values.accountId.toValue(),
      projectId: project.id.toValue(),
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFoundError);
  });

  it("should not ble to create a project member if member was already registered", async () => {
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
      fakeMemberRepository.create(member),
      fakeAccountRepository.create(account),
      fakeOwnerRepository.create(owner),
      fakeProjectRepository.create(project),
    ]);

    const input = {
      memberAccountEmail: account.values.email,
      ownerAccountId: owner.values.accountId.toValue(),
      projectId: project.id.toValue(),
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectMemberAlreadyExistsError);
  });

  it("should not be able to create a member if member is owner from this project", async () => {
    const account = makeAccount();
    const owner = makeOwner({
      accountId: account.id,
      accountEmail: account.values.email,
    });
    const project = makeProject({
      ownerId: owner.id,
    });

    await Promise.all([
      fakeAccountRepository.create(account),
      fakeOwnerRepository.create(owner),
      fakeProjectRepository.create(project),
    ]);

    const input = {
      memberAccountEmail: owner.values.accountEmail,
      ownerAccountId: owner.values.accountId.toValue(),
      projectId: project.id.toValue(),
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(OwnerCannotBeAddedAsMemberError);
  });
});

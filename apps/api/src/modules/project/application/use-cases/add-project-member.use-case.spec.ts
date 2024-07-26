import { makeAccount } from "@/test/factories/make-account";
import { makeMember } from "@/test/factories/make-member";
import { makeProject } from "@/test/factories/make-project";
import { FakeAccountRepository } from "@/test/repositories/fake-account.repository";
import { FakeMemberRepository } from "@/test/repositories/fake-member.repository";
import { FakeProjectMemberRepository } from "@/test/repositories/fake-project-member.repository";
import { FakeProjectRepository } from "@/test/repositories/fake-project.repository";

import { AddProjectMemberUseCase } from "./add-project-member.use-case";
import { MemberNotFoundError } from "./errors/member-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";
import { OwnerCannotBeAddedAsMemberError } from "./errors/owner-cannot-be-added-as-member.error";
import { ProjectMemberAlreadyExistsError } from "./errors/project-member-already-exists.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";

describe("AddProjectMemberUseCase", () => {
  let sut: AddProjectMemberUseCase;
  let fakeProjectRepository: FakeProjectRepository;
  let fakeAccountRepository: FakeAccountRepository;
  let fakeMemberRepository: FakeMemberRepository;
  let fakeProjectMemberRepository: FakeProjectMemberRepository;

  beforeEach(() => {
    fakeProjectRepository = new FakeProjectRepository();
    fakeAccountRepository = new FakeAccountRepository();
    fakeMemberRepository = new FakeMemberRepository();
    fakeProjectMemberRepository = new FakeProjectMemberRepository();

    sut = new AddProjectMemberUseCase(
      fakeMemberRepository,
      fakeProjectRepository,
      fakeAccountRepository,
      fakeProjectMemberRepository,
    );
  });

  it("should be able to add a new project member", async () => {
    const ownerAccount = makeAccount();
    const account = makeAccount();
    const project = makeProject({
      ownerId: ownerAccount.id,
    });
    await Promise.all([
      fakeProjectRepository.create(project),
      fakeAccountRepository.create(account),
      fakeAccountRepository.create(ownerAccount),
    ]);

    const input = {
      memberAccountEmail: account.values.email,
      ownerAccountId: ownerAccount.id.toValue(),
      projectId: project.id.toValue(),
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(fakeMemberRepository.members.length).toBe(1);
    expect(fakeProjectMemberRepository.projectMembers.length).toBe(1);
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

  it("should not be able to create a project member if owner ins't owner from this project", async () => {
    const account = makeAccount();
    const project = makeProject();
    await Promise.all([fakeProjectRepository.create(project), fakeAccountRepository.create(account)]);

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
    const project = makeProject({
      ownerId: account.id,
    });
    await Promise.all([fakeProjectRepository.create(project), fakeAccountRepository.create(account)]);

    const input = {
      memberAccountEmail: "invalid-member-account-email",
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(MemberNotFoundError);
  });

  it("should ble to create a project member if member was already registered", async () => {
    const account = makeAccount();
    const ownerAccount = makeAccount();
    const project = makeProject({
      ownerId: ownerAccount.id,
    });
    const member = makeMember({
      accountId: account.id,
    });

    await Promise.all([
      fakeAccountRepository.create(ownerAccount),
      fakeMemberRepository.create(member),
      fakeAccountRepository.create(account),
      fakeProjectRepository.create(project),
    ]);

    const input = {
      memberAccountEmail: account.values.email,
      ownerAccountId: ownerAccount.id.toValue(),
      projectId: project.id.toValue(),
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(fakeMemberRepository.members.length).toBe(1);
    expect(fakeProjectMemberRepository.projectMembers.length).toBe(1);
  });

  it("should not be able to create a member if member is owner from this project", async () => {
    const account = makeAccount();
    const project = makeProject({
      ownerId: account.id,
    });
    const member = makeMember({
      accountId: account.id,
    });

    await Promise.all([
      fakeAccountRepository.create(account),
      fakeProjectRepository.create(project),
      fakeMemberRepository.create(member),
    ]);

    const input = {
      memberAccountEmail: account.values.email,
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(OwnerCannotBeAddedAsMemberError);
  });

  it("should not be able to add project member if this member already was added to a specific project", async () => {
    const ownerAccount = makeAccount();
    const account = makeAccount();
    const project = makeProject({
      ownerId: ownerAccount.id,
    });
    await Promise.all([
      fakeProjectRepository.create(project),
      fakeAccountRepository.create(account),
      fakeAccountRepository.create(ownerAccount),
    ]);

    const input = {
      memberAccountEmail: account.values.email,
      ownerAccountId: ownerAccount.id.toValue(),
      projectId: project.id.toValue(),
    };
    await sut.execute(input);

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectMemberAlreadyExistsError);
  });
});

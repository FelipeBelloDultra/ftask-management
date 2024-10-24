import { makeAccount } from "@/test/factories/make-account";
import { makeMember } from "@/test/factories/make-member";
import { makeProject } from "@/test/factories/make-project";
import { InMemoryAccountRepository } from "@/test/repositories/in-memory-account.repository";
import { InMemoryInviteRepository } from "@/test/repositories/in-memory-invite.repository";
import { InMemoryMemberRepository } from "@/test/repositories/in-memory-member.repository";
import { InMemoryProjectRepository } from "@/test/repositories/in-memory-project.repository";

import { AddProjectMemberDto } from "../dtos/add-project-member-dto";

import { AddProjectMemberUseCase } from "./add-project-member.use-case";
import { MemberNotFoundError } from "./errors/member-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";
import { OwnerCannotBeAddedAsMemberError } from "./errors/owner-cannot-be-added-as-member.error";
import { ProjectMemberAlreadyExistsError } from "./errors/project-member-already-exists.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";

describe("AddProjectMemberUseCase", () => {
  let sut: AddProjectMemberUseCase;
  let inMemoryProjectRepository: InMemoryProjectRepository;
  let inMemoryAccountRepository: InMemoryAccountRepository;
  let inMemoryMemberRepository: InMemoryMemberRepository;
  let inMemoryInviteRepository: InMemoryInviteRepository;

  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository();
    inMemoryAccountRepository = new InMemoryAccountRepository();
    inMemoryMemberRepository = new InMemoryMemberRepository();
    inMemoryInviteRepository = new InMemoryInviteRepository();

    sut = new AddProjectMemberUseCase(
      inMemoryMemberRepository,
      inMemoryProjectRepository,
      inMemoryAccountRepository,
      inMemoryInviteRepository,
    );
  });

  it("should be able to add a new project member", async () => {
    const ownerAccount = makeAccount();
    const account = makeAccount();
    const project = makeProject({
      ownerId: ownerAccount.id,
    });
    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryAccountRepository.create(account),
      inMemoryAccountRepository.create(ownerAccount),
    ]);

    const input = AddProjectMemberDto.create({
      memberAccountEmail: account.email,
      ownerAccountId: ownerAccount.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryMemberRepository.members.length).toBe(1);
    expect(inMemoryInviteRepository.invites.length).toBe(1);
  });

  it("should not be able to add project member if project does not exists", async () => {
    const input = AddProjectMemberDto.create({
      memberAccountEmail: "member-account-email",
      ownerAccountId: "owner-account-id",
      projectId: "invalid-project-id",
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should not be able to create a project member if owner ins't owner from this project", async () => {
    const account = makeAccount();
    const project = makeProject();
    await Promise.all([inMemoryProjectRepository.create(project), inMemoryAccountRepository.create(account)]);

    const input = AddProjectMemberDto.create({
      memberAccountEmail: account.email,
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to create a project member if member email does not exists", async () => {
    const account = makeAccount();
    const project = makeProject({
      ownerId: account.id,
    });
    await Promise.all([inMemoryProjectRepository.create(project), inMemoryAccountRepository.create(account)]);

    const input = AddProjectMemberDto.create({
      memberAccountEmail: "invalid-member-account-email",
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(MemberNotFoundError);
  });

  it("should be able to create add member to project", async () => {
    const account = makeAccount();
    const ownerAccount = makeAccount();
    const project = makeProject({
      ownerId: ownerAccount.id,
    });

    await Promise.all([
      inMemoryAccountRepository.create(ownerAccount),
      inMemoryAccountRepository.create(account),
      inMemoryProjectRepository.create(project),
    ]);

    const input = AddProjectMemberDto.create({
      memberAccountEmail: account.email,
      ownerAccountId: ownerAccount.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    console.log(result);

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryMemberRepository.members.length).toBe(1);
    expect(inMemoryInviteRepository.invites.length).toBe(1);
  });

  it("should not be able to create a member if member is owner from this project", async () => {
    const account = makeAccount();
    const project = makeProject({
      ownerId: account.id,
    });
    const member = makeMember({
      accountId: account.id,
      projectId: project.id,
    });

    await Promise.all([
      inMemoryAccountRepository.create(account),
      inMemoryProjectRepository.create(project),
      inMemoryMemberRepository.create(member),
    ]);

    const input = AddProjectMemberDto.create({
      memberAccountEmail: account.email,
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
    });

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
      inMemoryProjectRepository.create(project),
      inMemoryAccountRepository.create(account),
      inMemoryAccountRepository.create(ownerAccount),
    ]);

    const input = AddProjectMemberDto.create({
      memberAccountEmail: account.email,
      ownerAccountId: ownerAccount.id.toValue(),
      projectId: project.id.toValue(),
    });
    await sut.execute(input);

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectMemberAlreadyExistsError);
  });
});

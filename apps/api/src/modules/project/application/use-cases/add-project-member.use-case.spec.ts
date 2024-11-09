import { makeAccount } from "@/test/factories/make-account";
import { makeParticipant } from "@/test/factories/make-participant";
import { makeProject } from "@/test/factories/make-project";
import { InMemoryAccountRepository } from "@/test/repositories/in-memory-account.repository";
import { InMemoryInviteRepository } from "@/test/repositories/in-memory-invite.repository";
import { InMemoryParticipantRepository } from "@/test/repositories/in-memory-participant.repository";
import { InMemoryProjectRepository } from "@/test/repositories/in-memory-project.repository";

import { ParticipantRole } from "../../domain/entity/value-objects/participant-role";
import { AddProjectMemberDto } from "../dtos/add-project-member-dto";

import { AddProjectMemberUseCase } from "./add-project-member.use-case";
import { MemberNotFoundError } from "./errors/member-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";
import { OwnerCannotBeAddedAsMemberError } from "./errors/owner-cannot-be-added-as-member.error";
import { ProjectMemberAlreadyExistsError } from "./errors/project-member-already-exists.error";

describe("AddProjectMemberUseCase", () => {
  let sut: AddProjectMemberUseCase;
  let inMemoryProjectRepository: InMemoryProjectRepository;
  let inMemoryAccountRepository: InMemoryAccountRepository;
  let inMemoryInviteRepository: InMemoryInviteRepository;
  let inMemoryParticipantRepository: InMemoryParticipantRepository;

  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository();
    inMemoryAccountRepository = new InMemoryAccountRepository();
    inMemoryInviteRepository = new InMemoryInviteRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository(
      inMemoryProjectRepository,
      inMemoryAccountRepository,
    );

    sut = new AddProjectMemberUseCase(
      inMemoryAccountRepository,
      inMemoryInviteRepository,
      inMemoryParticipantRepository,
    );
  });

  it("should be able to add a new project member", async () => {
    const owner = makeAccount();
    const project = makeProject({ ownerId: owner.id });
    const member = makeAccount();
    const ownerParticipant = makeParticipant({
      accountId: owner.id,
      projectId: project.id,
      role: ParticipantRole.createAsOwner(),
    });

    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryParticipantRepository.create(ownerParticipant),
      inMemoryAccountRepository.create(owner),
      inMemoryAccountRepository.create(member),
    ]);

    const input = AddProjectMemberDto.create({
      memberAccountEmail: member.email,
      ownerAccountId: owner.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryInviteRepository.invites.length).toBe(1);
    expect(inMemoryParticipantRepository.participants).length(2);
  });

  it("should not be able to add project member if owner does not exists", async () => {
    const input = AddProjectMemberDto.create({
      memberAccountEmail: "invalid-email",
      ownerAccountId: "invalid-id",
      projectId: "invalid-id",
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to create a project member if ownerId ins't owner from this project", async () => {
    const account = makeAccount();
    const project = makeProject({ ownerId: account.id });
    const participant = makeParticipant({
      accountId: account.id,
      projectId: project.id,
      role: ParticipantRole.createAsMember(),
    });

    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryParticipantRepository.create(participant),
      inMemoryAccountRepository.create(account),
    ]);

    const input = AddProjectMemberDto.create({
      memberAccountEmail: account.email,
      ownerAccountId: account.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to add project member if member email is equal owner email", async () => {
    const owner = makeAccount();
    const project = makeProject({ ownerId: owner.id });
    const participant = makeParticipant({
      accountId: owner.id,
      projectId: project.id,
      role: ParticipantRole.createAsOwner(),
    });

    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryParticipantRepository.create(participant),
      inMemoryAccountRepository.create(owner),
    ]);

    const input = AddProjectMemberDto.create({
      memberAccountEmail: owner.email,
      ownerAccountId: owner.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(OwnerCannotBeAddedAsMemberError);
  });

  it("should not be able to add member to project if email does match with database account", async () => {
    const owner = makeAccount();
    const project = makeProject({ ownerId: owner.id });
    const participant = makeParticipant({
      accountId: owner.id,
      projectId: project.id,
      role: ParticipantRole.createAsOwner(),
    });

    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryParticipantRepository.create(participant),
      inMemoryAccountRepository.create(owner),
    ]);

    const input = AddProjectMemberDto.create({
      memberAccountEmail: "fake@email.com",
      ownerAccountId: owner.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(MemberNotFoundError);
  });

  it("should not be able to create member if member already exists", async () => {
    const owner = makeAccount();
    const member = makeAccount();
    const project = makeProject({ ownerId: owner.id });
    const ownerParticipant = makeParticipant({
      accountId: owner.id,
      projectId: project.id,
      role: ParticipantRole.createAsOwner(),
    });
    const memberParticipant = makeParticipant({
      accountId: member.id,
      projectId: project.id,
      role: ParticipantRole.createAsMember(),
    });

    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryParticipantRepository.create(ownerParticipant),
      inMemoryParticipantRepository.create(memberParticipant),
      inMemoryAccountRepository.create(owner),
      inMemoryAccountRepository.create(member),
    ]);

    const input = AddProjectMemberDto.create({
      memberAccountEmail: member.email,
      ownerAccountId: owner.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectMemberAlreadyExistsError);
  });
});

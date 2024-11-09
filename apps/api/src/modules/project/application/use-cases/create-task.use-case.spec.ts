import { makeAccount } from "@/test/factories/make-account";
import { makeInvite } from "@/test/factories/make-invite";
import { makeParticipant } from "@/test/factories/make-participant";
import { makeProject } from "@/test/factories/make-project";
import { InMemoryAccountRepository } from "@/test/repositories/in-memory-account.repository";
import { InMemoryInviteRepository } from "@/test/repositories/in-memory-invite.repository";
import { InMemoryParticipantRepository } from "@/test/repositories/in-memory-participant.repository";
import { InMemoryProjectRepository } from "@/test/repositories/in-memory-project.repository";
import { InMemoryTaskRepository } from "@/test/repositories/in-memory-task.repository";

import { InvitationStatus, InvitationStatusValues } from "../../domain/entity/value-objects/invitation-status";
import { ParticipantRole } from "../../domain/entity/value-objects/participant-role";
import { CreateTaskDto } from "../dtos/create-task-dto";

import { CreateTaskUseCase } from "./create-task.use-case";
import { NotAllowedError } from "./errors/not-allowed.error";
import { ProjectMemberNotFoundError } from "./errors/project-member-not-found.error";

describe("CreateTaskUseCase", () => {
  let sut: CreateTaskUseCase;
  let inMemoryProjectRepository: InMemoryProjectRepository;
  let inMemoryInviteRepository: InMemoryInviteRepository;
  let inMemoryTaskRepository: InMemoryTaskRepository;
  let inMemoryParticipantRepository: InMemoryParticipantRepository;
  let inMemoryAccountRepository: InMemoryAccountRepository;

  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryTaskRepository();
    inMemoryProjectRepository = new InMemoryProjectRepository();
    inMemoryInviteRepository = new InMemoryInviteRepository();
    inMemoryAccountRepository = new InMemoryAccountRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository(
      inMemoryProjectRepository,
      inMemoryAccountRepository,
    );

    sut = new CreateTaskUseCase(
      inMemoryTaskRepository,
      inMemoryProjectRepository,
      inMemoryInviteRepository,
      inMemoryParticipantRepository,
    );
  });

  it("should be able to create a new task", async () => {
    const ownerAccount = makeAccount();
    const project = makeProject({ ownerId: ownerAccount.id });
    const ownerParticipant = makeParticipant({
      accountId: ownerAccount.id,
      projectId: project.id,
      role: ParticipantRole.createAsOwner(),
    });
    const member = makeAccount();
    const memberParticipant = makeParticipant({
      projectId: project.id,
      accountId: member.id,
      role: ParticipantRole.createAsMember(),
    });
    const invite = makeInvite({
      projectId: project.id,
      memberId: member.id,
    });
    invite.status.setAccepted();

    await Promise.all([
      inMemoryInviteRepository.create(invite),
      inMemoryProjectRepository.create(project),
      inMemoryAccountRepository.create(ownerAccount),
      inMemoryAccountRepository.create(member),
      inMemoryParticipantRepository.create(ownerParticipant),
      inMemoryParticipantRepository.create(memberParticipant),
    ]);

    const input = CreateTaskDto.create({
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
      assigneeId: member.id.toValue(),
      ownerAccountId: ownerAccount.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
  });

  it("should not be able to create new task if owner account does not exist", async () => {
    const input = CreateTaskDto.create({
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
      assigneeId: makeAccount().id.toValue(),
      ownerAccountId: "invalid-id",
      projectId: makeProject().id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to create new task if account is not owner of project", async () => {
    const project = makeProject();
    const anyParticipant = makeParticipant({
      projectId: project.id,
      role: ParticipantRole.createAsMember(), //
    });
    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryParticipantRepository.create(anyParticipant),
    ]);

    const input = CreateTaskDto.create({
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
      assigneeId: "any-assignee",
      ownerAccountId: anyParticipant.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to create new task if the assignee id is not participant from project", async () => {
    const ownerAccount = makeAccount();
    const project = makeProject({ ownerId: ownerAccount.id });
    const ownerParticipant = makeParticipant({
      accountId: ownerAccount.id,
      projectId: project.id,
      role: ParticipantRole.createAsOwner(),
    });

    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryAccountRepository.create(ownerAccount),
      inMemoryParticipantRepository.create(ownerParticipant),
    ]);

    const input = CreateTaskDto.create({
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
      assigneeId: "invalid-id",
      ownerAccountId: ownerAccount.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectMemberNotFoundError);
  });

  it("should not be able to create new task if project invite does not exists", async () => {
    const ownerAccount = makeAccount();
    const project = makeProject({ ownerId: ownerAccount.id });
    const ownerParticipant = makeParticipant({
      accountId: ownerAccount.id,
      projectId: project.id,
      role: ParticipantRole.createAsOwner(),
    });
    const member = makeAccount();
    const memberParticipant = makeParticipant({
      projectId: project.id,
      accountId: member.id,
      role: ParticipantRole.createAsMember(),
    });

    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryAccountRepository.create(ownerAccount),
      inMemoryAccountRepository.create(member),
      inMemoryParticipantRepository.create(ownerParticipant),
      inMemoryParticipantRepository.create(memberParticipant),
    ]);

    const input = CreateTaskDto.create({
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
      assigneeId: member.id.toValue(),
      ownerAccountId: ownerAccount.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to create new task if project invite is blocked", async () => {
    const ownerAccount = makeAccount();
    const project = makeProject({ ownerId: ownerAccount.id });
    const ownerParticipant = makeParticipant({
      accountId: ownerAccount.id,
      projectId: project.id,
      role: ParticipantRole.createAsOwner(),
    });
    const member = makeAccount();
    const memberParticipant = makeParticipant({
      projectId: project.id,
      accountId: member.id,
      role: ParticipantRole.createAsMember(),
    });
    const invite = makeInvite({
      memberId: memberParticipant.id,
      projectId: project.id,
      status: InvitationStatus.create(InvitationStatusValues.Declined),
    });

    await Promise.all([
      inMemoryProjectRepository.create(project),
      inMemoryAccountRepository.create(ownerAccount),
      inMemoryAccountRepository.create(member),
      inMemoryParticipantRepository.create(ownerParticipant),
      inMemoryParticipantRepository.create(memberParticipant),
      inMemoryInviteRepository.create(invite),
    ]);

    const input = CreateTaskDto.create({
      title: "Task title",
      description: "Task description",
      dueDate: new Date(),
      assigneeId: member.id.toValue(),
      ownerAccountId: ownerAccount.id.toValue(),
      projectId: project.id.toValue(),
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});

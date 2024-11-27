import { Right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { makeInvite } from "@/test/factories/make-invite";
import { InMemoryInviteRepository } from "@/test/repositories/in-memory-invite.repository";
import { InMemoryProjectRepository } from "@/test/repositories/in-memory-project.repository";

import { Invite } from "../../domain/entity/invite";
import { DueDate } from "../../domain/entity/value-objects/due-date";
import { InvitationStatus, InvitationStatusValues } from "../../domain/entity/value-objects/invitation-status";
import { NewStatusOptions, UpdateInviteStatusDto } from "../dtos/update-invite-status-dto";

import { ExpiredInviteError } from "./errors/expired-invite.error";
import { InvalidStatusTransitionError } from "./errors/invalid-status-transition.error";
import { InviteNotFoundError } from "./errors/invite-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";
import { UpdateInviteStatusUseCase } from "./update-invite-status.use-case";

describe("UpdateInviteStatusUseCase", () => {
  let sut: UpdateInviteStatusUseCase;
  let inMemoryInviteRepository: InMemoryInviteRepository;
  let inMemoryProjectRepository: InMemoryProjectRepository;

  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository();
    inMemoryInviteRepository = new InMemoryInviteRepository(inMemoryProjectRepository);
    sut = new UpdateInviteStatusUseCase(inMemoryInviteRepository);
  });

  it("should be to update the status of the invite to accepted", async () => {
    const invite = makeInvite();
    await inMemoryInviteRepository.create(invite);

    const input = UpdateInviteStatusDto.create({
      accountId: invite.memberId.toValue(),
      inviteId: invite.id.toValue(),
      newStatus: NewStatusOptions.Accept,
    });

    const result = (await sut.execute(input)) as Right<never, { invite: Invite }>;

    expect(result.isRight()).toBeTruthy();
    expect(result.value.invite.status.value).toEqual(InvitationStatusValues.Accepted);
  });

  it("should be to update the status of the invite to accepted", async () => {
    const invite = makeInvite();
    await inMemoryInviteRepository.create(invite);

    const input = UpdateInviteStatusDto.create({
      accountId: invite.memberId.toValue(),
      inviteId: invite.id.toValue(),
      newStatus: NewStatusOptions.Reject,
    });

    const result = (await sut.execute(input)) as Right<never, { invite: Invite }>;

    expect(result.isRight()).toBeTruthy();
    expect(result.value.invite.status.value).toEqual(InvitationStatusValues.Declined);
  });

  it("should not be to update the status of the invite if the invite not exists", async () => {
    const input = UpdateInviteStatusDto.create({
      accountId: makeInvite().memberId.toValue(),
      inviteId: UniqueEntityID.create().toValue(),
      newStatus: NewStatusOptions.Accept,
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InviteNotFoundError);
  });

  it("should not be to update the status of the invite if it is expired", async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const invite = makeInvite({ expirationDate: DueDate.create(pastDate) });
    await inMemoryInviteRepository.create(invite);
    const input = UpdateInviteStatusDto.create({
      accountId: invite.memberId.toValue(),
      inviteId: invite.id.toValue(),
      newStatus: NewStatusOptions.Accept,
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ExpiredInviteError);
  });

  it("should not be to update the status of the invite if the invite is from another account", async () => {
    const invite = makeInvite();
    await inMemoryInviteRepository.create(invite);
    const input = UpdateInviteStatusDto.create({
      accountId: "different-account-id",
      inviteId: invite.id.toValue(),
      newStatus: NewStatusOptions.Accept,
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to update the status if status is not 'pending'", async () => {
    const invite = makeInvite({
      status: InvitationStatus.create(InvitationStatusValues.Accepted),
    });
    await inMemoryInviteRepository.create(invite);

    const input = UpdateInviteStatusDto.create({
      accountId: invite.memberId.toValue(),
      inviteId: invite.id.toValue(),
      newStatus: NewStatusOptions.Accept,
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidStatusTransitionError);
  });
});

import { inject, injectable } from "tsyringe";

import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

import { Invite } from "../../domain/entity/invite";
import { NewStatusOptions, UpdateInviteStatusDto } from "../dtos/update-invite-status-dto";
import { InviteRepository } from "../repositories/invite.repository";

import { ExpiredInviteError } from "./errors/expired-invite.error";
import { InvalidStatusTransitionError } from "./errors/invalid-status-transition.error";
import { InviteNotFoundError } from "./errors/invite-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";

type OnError = InviteNotFoundError | NotAllowedError | ExpiredInviteError | InvalidStatusTransitionError;
type OnSuccess = { invite: Invite };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class UpdateInviteStatusUseCase {
  public constructor(
    @inject("InviteRepository")
    private readonly inviteRepository: InviteRepository,
  ) {}

  public async execute(input: UpdateInviteStatusDto): Promise<Output> {
    const inviteId = UniqueEntityID.create(input.inviteId);
    const invite = await this.inviteRepository.findById(inviteId);
    if (!invite) {
      return left(new InviteNotFoundError());
    }

    const accountId = UniqueEntityID.create(input.accountId);
    if (!invite.memberId.equals(accountId)) {
      return left(new NotAllowedError());
    }

    if (invite.expirationDate.isExpired()) {
      return left(new ExpiredInviteError());
    }

    if (!invite.canChangeStatus()) {
      return left(new InvalidStatusTransitionError());
    }

    switch (input.newStatus) {
      case NewStatusOptions.Accept:
        invite.status.setAccepted();
        break;
      case NewStatusOptions.Reject:
        invite.status.setDeclined();
        break;
    }

    await this.inviteRepository.save(invite);

    return right({ invite });
  }
}

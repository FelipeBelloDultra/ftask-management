import { inject, injectable } from "tsyringe";

import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { AccountRepository } from "@/modules/account/application/repositories/account.repository";

import { Invite } from "../../domain/entity/invite";
import { Participant } from "../../domain/entity/participant";
import { InviteDetail } from "../../domain/entity/value-objects/invite-detail";
import { ParticipantRole } from "../../domain/entity/value-objects/participant-role";
import { AddProjectMemberDto } from "../dtos/add-project-member-dto";
import { InviteRepository } from "../repositories/invite.repository";
import { ParticipantRepository } from "../repositories/participant.repository";

import { MemberNotFoundError } from "./errors/member-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";
import { OwnerCannotBeAddedAsMemberError } from "./errors/owner-cannot-be-added-as-member.error";
import { ProjectMemberAlreadyExistsError } from "./errors/project-member-already-exists.error";

type OnError =
  | NotAllowedError
  | MemberNotFoundError
  | ProjectMemberAlreadyExistsError
  | OwnerCannotBeAddedAsMemberError;
type OnSuccess = { inviteDetail: InviteDetail };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class AddProjectMemberUseCase {
  public constructor(
    @inject("AccountRepository")
    private readonly accountRepository: AccountRepository,
    @inject("InviteRepository")
    private readonly inviteRepository: InviteRepository,
    @inject("ParticipantRepository")
    private readonly participantRepository: ParticipantRepository,
  ) {}

  public async execute(input: AddProjectMemberDto): Promise<Output> {
    const projectId = UniqueEntityID.create(input.projectId);
    const ownerAccountId = UniqueEntityID.create(input.ownerAccountId);

    const ownerParticipant = await this.participantRepository.findDetailedByProjectIdAndAccountId(
      projectId,
      ownerAccountId,
    );
    const cannotBeAdded = !ownerParticipant || !ownerParticipant.role.isOwner();

    if (cannotBeAdded) {
      return left(new NotAllowedError());
    }

    const isMemberEmailEqualOwnerEmail = input.memberAccountEmail === ownerParticipant.account.email;
    if (isMemberEmailEqualOwnerEmail) {
      return left(new OwnerCannotBeAddedAsMemberError());
    }

    const account = await this.accountRepository.findByEmail(input.memberAccountEmail);
    if (!account) {
      return left(new MemberNotFoundError());
    }

    const member = await this.participantRepository.findByProjectIdAndAccountId(projectId, account.id);
    if (member) {
      return left(new ProjectMemberAlreadyExistsError());
    }

    const memberParticipant = Participant.create({
      accountId: account.id,
      projectId: projectId,
      role: ParticipantRole.createAsMember(),
    });
    await this.participantRepository.create(memberParticipant);

    const invite = Invite.create({
      memberId: account.id,
      projectId: projectId,
    });
    const inviteDetail = ownerParticipant.project.createInviteDetail(account, invite);

    await this.inviteRepository.create(invite);

    return right({
      inviteDetail,
    });
  }
}

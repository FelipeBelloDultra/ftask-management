import { ProjectInvites as PrismaProjectInvites } from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Invite } from "@/modules/project/domain/entity/invite";
import { DueDate } from "@/modules/project/domain/entity/value-objects/due-date";
import {
  InvitationStatus,
  InvitationStatusValues,
} from "@/modules/project/domain/entity/value-objects/invitation-status";

export class InviteMapper {
  public static toDomain(prismaInvite: PrismaProjectInvites): Invite {
    const status = {
      pending: InvitationStatusValues.Pending,
      accepted: InvitationStatusValues.Accepted,
      declined: InvitationStatusValues.Declined,
    };

    return Invite.create(
      {
        status: InvitationStatus.create(status[prismaInvite.status]),
        memberId: UniqueEntityID.create(prismaInvite.memberId),
        projectId: UniqueEntityID.create(prismaInvite.projectId),
        expirationDate: DueDate.create(prismaInvite.expiresAt),
        createdAt: prismaInvite.createdAt,
      },
      UniqueEntityID.create(prismaInvite.id),
    );
  }

  public static toPersistence(invite: Invite): PrismaProjectInvites {
    return {
      id: invite.id.toValue(),
      memberId: invite.memberId.toValue(),
      projectId: invite.projectId.toValue(),
      status: invite.status.value,
      expiresAt: invite.expirationDate.value,
      createdAt: invite.createdAt,
    };
  }
}

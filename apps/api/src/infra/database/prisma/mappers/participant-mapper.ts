import { Participant as PrismaParticipant } from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Participant } from "@/modules/project/domain/entity/participant";
import { ParticipantRole, ParticipantRoleValues } from "@/modules/project/domain/entity/value-objects/participant-role";

export class ParticipantMapper {
  public static toDomain(prismaParticipant: PrismaParticipant): Participant {
    const role = {
      owner: ParticipantRoleValues.Owner,
      member: ParticipantRoleValues.Member,
    };

    return Participant.create(
      {
        accountId: UniqueEntityID.create(prismaParticipant.accountId),
        projectId: UniqueEntityID.create(prismaParticipant.projectId),
        role: ParticipantRole.create(role[prismaParticipant.role]),
      },
      UniqueEntityID.create(prismaParticipant.id),
    );
  }

  public static toPersistence(participant: Participant): PrismaParticipant {
    return {
      id: participant.id.toValue(),
      accountId: participant.accountId.toValue(),
      projectId: participant.projectId.toValue(),
      role: participant.role.value,
    };
  }
}

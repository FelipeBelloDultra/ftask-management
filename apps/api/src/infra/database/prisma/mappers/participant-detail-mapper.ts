import {
  Account as PrismaAccount,
  ParticipantRole as PrismaParticipantRole,
  Project as PrismaProject,
} from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ParticipantDetail } from "@/modules/project/domain/entity/value-objects/participant-detail";
import { ParticipantRole, ParticipantRoleValues } from "@/modules/project/domain/entity/value-objects/participant-role";

import { AccountMapper } from "./account-mapper";
import { ProjectMapper } from "./project-mapper";

interface PrismaParticipantDetail {
  id: string;
  role: PrismaParticipantRole;
  account: PrismaAccount;
  project: PrismaProject;
}

export class ParticipantDetailMapper {
  public static toDomain(prismaParticipantDetail: PrismaParticipantDetail): ParticipantDetail {
    const role = {
      owner: ParticipantRoleValues.Owner,
      member: ParticipantRoleValues.Member,
    };

    return ParticipantDetail.create({
      id: UniqueEntityID.create(prismaParticipantDetail.id),
      account: AccountMapper.toDomain(prismaParticipantDetail.account),
      project: ProjectMapper.toDomain(prismaParticipantDetail.project),
      role: ParticipantRole.create(role[prismaParticipantDetail.role]),
    });
  }
}

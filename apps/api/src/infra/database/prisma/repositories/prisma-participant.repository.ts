import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ParticipantRepository } from "@/modules/project/application/repositories/participant.repository";
import { Participant } from "@/modules/project/domain/entity/participant";
import { ParticipantDetail } from "@/modules/project/domain/entity/value-objects/participant-detail";

import { ParticipantDetailMapper } from "../mappers/participant-detail-mapper";
import { ParticipantMapper } from "../mappers/participant-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaParticipantRepository implements ParticipantRepository {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async create(participant: Participant): Promise<void> {
    await this.prismaConnection.participant.create({
      data: ParticipantMapper.toPersistence(participant),
    });
  }

  public async findByProjectIdAndAccountId(
    projectId: UniqueEntityID,
    accountId: UniqueEntityID,
  ): Promise<Participant | null> {
    const participant = await this.prismaConnection.participant.findUnique({
      where: {
        accountId_projectId: {
          accountId: accountId.toValue(),
          projectId: projectId.toValue(),
        },
      },
    });

    if (!participant) {
      return null;
    }

    return ParticipantMapper.toDomain(participant);
  }

  public async findDetailedByProjectIdAndAccountId(
    projectId: UniqueEntityID,
    accountId: UniqueEntityID,
  ): Promise<ParticipantDetail | null> {
    const participant = await this.prismaConnection.participant.findUnique({
      where: {
        accountId_projectId: {
          accountId: accountId.toValue(),
          projectId: projectId.toValue(),
        },
      },
      include: {
        account: true,
        project: true,
      },
    });

    if (!participant) {
      return null;
    }

    return ParticipantDetailMapper.toDomain({
      id: participant.id,
      account: participant.account,
      project: participant.project,
      role: participant.role,
    });
  }
}

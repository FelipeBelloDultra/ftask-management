import { inject, injectable } from "tsyringe";

import { ParticipantRepository } from "@/modules/project/application/repositories/participant.repository";
import { Participant } from "@/modules/project/domain/entity/participant";

import { ParticipantMapper } from "../mappers/participant-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaParticipantRepository implements ParticipantRepository {
  public constructor(
    @inject("ParticipantRepository")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async create(participant: Participant): Promise<void> {
    await this.prismaConnection.participant.create({
      data: ParticipantMapper.toPersistence(participant),
    });
  }
}

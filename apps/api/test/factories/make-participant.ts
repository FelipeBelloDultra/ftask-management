import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ParticipantMapper } from "@/infra/database/prisma/mappers/participant-mapper";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { Participant, ParticipantProps } from "@/modules/project/domain/entity/participant";

export function makeParticipant(override: Partial<ParticipantProps> = {}, id?: UniqueEntityID): Participant {
  const participant = Participant.create(
    {
      accountId: UniqueEntityID.create(),
      projectId: UniqueEntityID.create(),
      ...override,
    },
    id,
  );

  return participant;
}

@injectable()
export class ParticipantFactory {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async makePrismaParticipant(override: Partial<ParticipantProps> = {}, id?: UniqueEntityID) {
    const participant = makeParticipant(override, id);

    await this.prismaConnection.participant.create({
      data: ParticipantMapper.toPersistence(participant),
    });

    return participant;
  }
}

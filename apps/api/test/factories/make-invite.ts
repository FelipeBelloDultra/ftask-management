import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { InviteMapper } from "@/infra/database/prisma/mappers/invite-mapper";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { Invite, InviteProps } from "@/modules/project/domain/entity/invite";

export function makeInvite(override: Partial<InviteProps> = {}, id?: UniqueEntityID): Invite {
  const invite = Invite.create(
    {
      memberId: UniqueEntityID.create(),
      projectId: UniqueEntityID.create(),
      ...override,
    },
    id,
  );

  return invite;
}

@injectable()
export class InviteFactory {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async makePrismaInvite(override: Partial<InviteProps> = {}, id?: UniqueEntityID) {
    const invite = makeInvite(override, id);

    await this.prismaConnection.projectInvites.create({
      data: InviteMapper.toPersistence(invite),
    });

    return invite;
  }
}

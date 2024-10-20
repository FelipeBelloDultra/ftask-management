import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { InviteRepository } from "@/modules/project/application/repositories/invite.repository";
import { Invite } from "@/modules/project/domain/entity/invite";

import { InviteMapper } from "../mappers/invite-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaInviteRepository implements InviteRepository {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async findById(inviteId: UniqueEntityID): Promise<Invite | null> {
    const invite = await this.prismaConnection.projectInvites.findUnique({
      where: {
        id: inviteId.toValue(),
      },
    });

    if (!invite) return null;

    return InviteMapper.toDomain(invite);
  }

  public async save(invite: Invite): Promise<void> {
    await this.prismaConnection.projectInvites.update({
      where: {
        id: invite.id.toValue(),
      },
      data: InviteMapper.toPersistence(invite),
    });
  }

  public async create(invite: Invite): Promise<void> {
    await this.prismaConnection.projectInvites.create({
      data: InviteMapper.toPersistence(invite),
    });
  }
}

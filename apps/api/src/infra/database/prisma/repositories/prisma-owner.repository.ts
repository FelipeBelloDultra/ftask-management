import { OwnerMapper } from "../mappers/owner-mapper";

import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { OwnerRepository } from "~/modules/account/application/repositories/owner.repository";
import type { Owner } from "~/modules/account/domain/entity/owner";
import type { PrismaConnection } from "../prisma-connection";

export class PrismaOwnerRepository implements OwnerRepository {
  public constructor(private readonly prismaConnection: PrismaConnection) {}

  public async create(owner: Owner): Promise<void> {
    await this.prismaConnection.owner.create({
      data: OwnerMapper.toPersistence(owner),
    });
  }

  public async findByAccountId(ownerId: UniqueEntityID): Promise<Owner | null> {
    const owner = await this.prismaConnection.owner.findUnique({
      where: {
        accountId: ownerId.toValue(),
      },
      select: {
        account: true,
        id: true,
      },
    });

    if (!owner) return null;

    return OwnerMapper.toDomain(owner);
  }
}

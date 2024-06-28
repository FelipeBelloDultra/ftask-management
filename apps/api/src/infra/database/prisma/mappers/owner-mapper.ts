import { Owner } from "~/account/domain/entity/owner";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

import type { Owner as PrismaOwner } from "@prisma/client";

interface PrismaOwnerWithAccount {
  id: string;
  account: {
    id: string;
    email: string;
    password: string;
    name: string;
  };
}

export class OwnerMapper {
  public static toDomain(prismaOwner: PrismaOwnerWithAccount): Owner {
    return Owner.create(
      {
        accountEmail: prismaOwner.account.email,
        accountName: prismaOwner.account.name,
        accountId: UniqueEntityID.create(prismaOwner.account.id),
      },
      UniqueEntityID.create(prismaOwner.id),
    );
  }

  public static toPersistence(owner: Owner): PrismaOwner {
    return {
      accountId: owner.values.accountId.toValue(),
      id: owner.id.toValue(),
      role: "owner",
    };
  }
}

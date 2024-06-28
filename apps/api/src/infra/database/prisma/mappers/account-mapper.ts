import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Account } from "~/modules/account/domain/entity/account";
import { Password } from "~/modules/account/domain/entity/value-objects/password";

import type { Account as PrismaAccount } from "@prisma/client";

export class AccountMapper {
  public static toDomain(prismaAccount: PrismaAccount): Account {
    return Account.create(
      {
        email: prismaAccount.email,
        name: prismaAccount.name,
        password: Password.create(prismaAccount.password, true),
      },
      UniqueEntityID.create(prismaAccount.id),
    );
  }

  public static async toPersistence(account: Account): Promise<PrismaAccount> {
    return {
      email: account.values.email,
      id: account.id.toValue(),
      name: account.values.name,
      password: await account.values.password.getHashed(),
    };
  }
}

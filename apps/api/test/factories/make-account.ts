import { faker } from "@faker-js/faker";
import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { AccountMapper } from "@/infra/database/prisma/mappers/account-mapper";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { Account, AccountProps } from "@/modules/account/domain/entity/account";
import { Password } from "@/modules/account/domain/entity/value-objects/password";

export function makeAccount(override: Partial<AccountProps> = {}, id?: UniqueEntityID): Account {
  const account = Account.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: Password.create(faker.internet.password()),
      ...override,
    },
    id,
  );

  return account;
}

@injectable()
export class AccountFactory {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async makePrismaAccount(override: Partial<AccountProps> = {}, id?: UniqueEntityID) {
    const account = makeAccount(override, id);

    await this.prismaConnection.account.create({
      data: await AccountMapper.toPersistence(account),
    });

    return account;
  }
}

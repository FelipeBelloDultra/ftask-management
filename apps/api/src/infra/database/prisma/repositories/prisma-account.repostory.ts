import { AccountMapper } from "../mappers/account-mapper";

import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { AccountRepository } from "~/modules/account/application/repositories/account.repository";
import type { Account } from "~/modules/account/domain/entity/account";
import type { PrismaConnection } from "../prisma-connection";

export class PrismaAccountRepository implements AccountRepository {
  public constructor(private readonly prismaConnection: PrismaConnection) {}

  public async findById(accountId: UniqueEntityID): Promise<Account | null> {
    const account = await this.prismaConnection.account.findUnique({
      where: {
        id: accountId.toValue(),
      },
    });

    if (!account) return null;

    return AccountMapper.toDomain(account);
  }

  public async findByEmail(email: string): Promise<Account | null> {
    const account = await this.prismaConnection.account.findUnique({
      where: {
        email: email,
      },
    });

    if (!account) return null;

    return AccountMapper.toDomain(account);
  }

  public async create(account: Account): Promise<void> {
    await this.prismaConnection.account.create({
      data: await AccountMapper.toPersistence(account),
    });
  }
}

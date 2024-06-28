import { AccountRepository } from "~/account/application/repositories/account.repository";
import { Account } from "~/account/domain/entity/account";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export class FakeAccountRepository implements AccountRepository {
  public readonly accounts: Account[] = [];

  public async findById(accountId: UniqueEntityID): Promise<Account | null> {
    const account = this.accounts.find((account) => account.id.equals(accountId));

    return account || null;
  }

  public async findByEmail(email: string): Promise<Account | null> {
    const account = this.accounts.find((account) => account.values.email === email);

    return account || null;
  }

  public async create(account: Account): Promise<void> {
    this.accounts.push(account);
  }
}

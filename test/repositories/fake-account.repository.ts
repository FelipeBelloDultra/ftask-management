import { AccountRepository } from "~/modules/project/application/repositories/account.repository";
import { Account } from "~/modules/project/domain/entity/account";

export class FakeAccountRepository implements AccountRepository {
  public readonly accounts: Account[] = [];

  public async findById(accountId: string): Promise<Account | null> {
    const account = this.accounts.find((account) => account.id.toValue() === accountId);

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

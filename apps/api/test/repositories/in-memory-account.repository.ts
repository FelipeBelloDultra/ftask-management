import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { AccountRepository } from "@/modules/account/application/repositories/account.repository";
import { Account } from "@/modules/account/domain/entity/account";

export class InMemoryAccountRepository implements AccountRepository {
  public readonly accounts: Account[] = [];

  public async findById(accountId: UniqueEntityID): Promise<Account | null> {
    const account = this.accounts.find((account) => account.id.equals(accountId));

    return account || null;
  }

  public async findByEmail(email: string): Promise<Account | null> {
    const account = this.accounts.find((account) => account.email === email);

    return account || null;
  }

  public async create(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  public async save(account: Account): Promise<void> {
    const accountsIndex = this.accounts.findIndex((n) => n.id.equals(account.id));

    if (accountsIndex !== -1) {
      this.accounts[accountsIndex] = account;
    }
  }
}

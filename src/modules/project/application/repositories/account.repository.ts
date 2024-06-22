import { Account } from "~/modules/project/domain/entity/account";

export abstract class AccountRepository {
  public abstract findById(accountId: string): Promise<Account | null>;
  public abstract findByEmail(email: string): Promise<Account | null>;
  public abstract create(account: Account): Promise<void>;
}

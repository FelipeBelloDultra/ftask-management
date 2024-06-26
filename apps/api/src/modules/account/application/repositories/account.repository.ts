import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Account } from "~/account/domain/entity/account";

export abstract class AccountRepository {
  public abstract findById(accountId: UniqueEntityID): Promise<Account | null>;
  public abstract findByEmail(email: string): Promise<Account | null>;
  public abstract create(account: Account): Promise<void>;
}

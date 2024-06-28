import { Account } from "~/account/domain/entity/account";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface AccountRepository {
  findById(accountId: UniqueEntityID): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  create(account: Account): Promise<void>;
}

import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Account } from "~/account/domain/entity/account";

export interface AccountRepository {
  findById(accountId: UniqueEntityID): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  create(account: Account): Promise<void>;
}

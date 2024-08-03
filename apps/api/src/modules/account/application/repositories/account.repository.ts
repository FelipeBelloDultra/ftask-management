import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Account } from "@/modules/account/domain/entity/account";

export interface AccountRepository {
  findById(accountId: UniqueEntityID): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  create(account: Account): Promise<void>;
  save(accountL: Account): Promise<void>;
}

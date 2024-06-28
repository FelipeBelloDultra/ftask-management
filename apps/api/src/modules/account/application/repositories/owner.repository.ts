import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Owner } from "~/account/domain/entity/owner";

export abstract class OwnerRepository {
  public abstract create(owner: Owner): Promise<void>;
  public abstract findByAccountId(accountId: UniqueEntityID): Promise<Owner | null>;
}

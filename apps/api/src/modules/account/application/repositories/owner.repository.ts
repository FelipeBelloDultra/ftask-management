import { Owner } from "~/account/domain/entity/owner";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export abstract class OwnerRepository {
  public abstract create(owner: Owner): Promise<void>;
  public abstract findByAccountId(accountId: UniqueEntityID): Promise<Owner | null>;
}

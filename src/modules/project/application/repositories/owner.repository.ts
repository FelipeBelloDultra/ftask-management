import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Owner } from "~/modules/project/domain/entity/owner";

export abstract class OwnerRepository {
  public abstract create(owner: Owner): Promise<void>;
  public abstract findByAccountId(ownerId: UniqueEntityID): Promise<Owner | null>;
}

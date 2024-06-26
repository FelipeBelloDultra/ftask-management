import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Owner } from "~/account/domain/entity/owner";

export interface OwnerRepository {
  create(owner: Owner): Promise<void>;
  findByAccountId(ownerId: UniqueEntityID): Promise<Owner | null>;
}

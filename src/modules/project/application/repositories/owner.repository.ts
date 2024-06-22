import { Owner } from "~/modules/project/domain/entity/owner";

export abstract class OwnerRepository {
  public abstract create(owner: Owner): Promise<void>;
  public abstract findByUserId(ownerId: string): Promise<Owner | null>;
}

import { Owner } from "~/modules/project/domain/entity/owner";

export abstract class OwnerRepository {
  public abstract create(owner: Owner): Promise<void>;
  public abstract findByAccountId(ownerId: string): Promise<Owner | null>;
}

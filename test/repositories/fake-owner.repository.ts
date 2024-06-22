import { OwnerRepository } from "~/modules/project/application/repositories/owner.repository";
import { Owner } from "~/modules/project/domain/entity/owner";

export class FakeOwnerRepository implements OwnerRepository {
  public readonly owners: Owner[] = [];

  public async create(owner: Owner): Promise<void> {
    this.owners.push(owner);
  }

  public async findByUserId(ownerId: string): Promise<Owner | null> {
    const owner = this.owners.find((owner) => owner.values.userId.toValue() === ownerId);

    return owner || null;
  }
}

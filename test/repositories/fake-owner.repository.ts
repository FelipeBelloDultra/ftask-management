import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Owner } from "~/account/domain/entity/owner";
import type { OwnerRepository } from "~/account/application/repositories/owner.repository";

export class FakeOwnerRepository implements OwnerRepository {
  public readonly owners: Owner[] = [];

  public async create(owner: Owner): Promise<void> {
    this.owners.push(owner);
  }

  public async findByAccountId(accountId: UniqueEntityID): Promise<Owner | null> {
    const owner = this.owners.find((owner) => owner.values.accountId.equals(accountId));

    return owner || null;
  }
}

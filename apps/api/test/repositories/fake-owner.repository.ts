import { OwnerRepository } from "~/account/application/repositories/owner.repository";
import { Owner } from "~/account/domain/entity/owner";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

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
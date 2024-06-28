import { faker } from "@faker-js/faker";

import { Owner, OwnerProps } from "~/account/domain/entity/owner";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export function makeOwner(override: Partial<OwnerProps> = {}, id?: UniqueEntityID): Owner {
  const owner = Owner.create(
    {
      accountEmail: faker.internet.email(),
      accountName: faker.person.fullName(),
      accountId: UniqueEntityID.create(),
      ...override,
    },
    id,
  );

  return owner;
}

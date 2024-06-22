import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Owner, OwnerProps } from "~/modules/project/domain/entity/owner";

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

import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Owner } from "~/account/domain/entity/owner";

import type { OwnerProps } from "~/account/domain/entity/owner";

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

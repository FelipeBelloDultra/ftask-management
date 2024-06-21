import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Owner, OwnerProps } from "~/modules/project/domain/entity/owner";

export function makeOwner(override: Partial<OwnerProps> = {}, id?: UniqueEntityID): Owner {
  const owner = Owner.create(
    {
      userEmail: faker.internet.email(),
      userName: faker.person.fullName(),
      userId: UniqueEntityID.create(),
      ...override,
    },
    id,
  );

  return owner;
}

import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { User, UserProps } from "~/modules/project/domain/entity/user";

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityID): User {
  const user = User.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      ...override,
    },
    id,
  );

  return user;
}

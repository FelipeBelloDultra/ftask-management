import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Account, AccountProps } from "~/modules/project/domain/entity/account";
import { Password } from "~/modules/project/domain/entity/value-objects/password";

export function makeAccount(override: Partial<AccountProps> = {}, id?: UniqueEntityID): Account {
  const account = Account.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: Password.create(faker.internet.password()),
      ...override,
    },
    id,
  );

  return account;
}

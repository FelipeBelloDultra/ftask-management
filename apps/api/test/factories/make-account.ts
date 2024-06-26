import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Account, AccountProps } from "~/account/domain/entity/account";
import { Password } from "~/account/domain/entity/value-objects/password";

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

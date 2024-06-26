import { Entity } from "~/core/entity/entity";

import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Password } from "./value-objects/password";

export interface AccountProps {
  name: string;
  email: string;
  password: Password;
}

export class Account extends Entity<AccountProps> {
  public static create(props: AccountProps, id?: UniqueEntityID) {
    return new Account(props, id);
  }
}
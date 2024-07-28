import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

import { Password } from "./value-objects/password";

export interface AccountProps {
  name: string;
  email: string;
  password: Password;
}

export class Account extends Entity<AccountProps> {
  public get name() {
    return this.props.name;
  }

  public get email() {
    return this.props.email;
  }

  public get password() {
    return this.props.password;
  }

  public static create(props: AccountProps, id?: UniqueEntityID) {
    return new Account(props, id);
  }
}

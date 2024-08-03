import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";

import { Password } from "./value-objects/password";

export interface AccountProps {
  name: string;
  email: string;
  password: Password;
  pictureUrl: string | null;
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

  public get pictureUrl() {
    return this.props.pictureUrl;
  }

  public set pictureUrl(value: string | null) {
    this.props.pictureUrl = value;
  }

  public static create(props: Optional<AccountProps, "pictureUrl">, id?: UniqueEntityID) {
    return new Account(
      {
        ...props,
        pictureUrl: props.pictureUrl ?? null,
      },
      id,
    );
  }
}

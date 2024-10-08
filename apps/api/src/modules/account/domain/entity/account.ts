import { AggregateRoot } from "@/core/entity/aggregate-root";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { CompleteAccountProfileEvent } from "@/modules/account/domain/events/complete-account-profile-event";

import { Password } from "./value-objects/password";
import { PictureUrl } from "./value-objects/picture-url";

export interface AccountProps {
  name: string;
  email: string;
  password: Password;
  pictureUrl: PictureUrl | null;
}

export class Account extends AggregateRoot<AccountProps> {
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

  public set pictureUrl(value: PictureUrl | null) {
    this.props.pictureUrl = value;
  }

  public static create(props: Optional<AccountProps, "pictureUrl">, id?: UniqueEntityID) {
    const isNewAccount = !id;
    const account = new Account(
      {
        ...props,
        pictureUrl: props.pictureUrl ?? null,
      },
      id,
    );

    if (isNewAccount) {
      account.addDomainEvent(new CompleteAccountProfileEvent(account));
    }

    return account;
  }
}

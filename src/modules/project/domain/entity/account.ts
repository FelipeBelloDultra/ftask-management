import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface AccountProps {
  name: string;
  email: string;
}

export class Account extends Entity<AccountProps> {
  public static create(props: AccountProps, id?: UniqueEntityID) {
    return new Account(props, id);
  }
}

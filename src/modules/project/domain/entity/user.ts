import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface UserProps {
  name: string;
  email: string;
}

export class User extends Entity<UserProps> {
  public static create(props: UserProps, id?: UniqueEntityID) {
    return new User(props, id);
  }
}

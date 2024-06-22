import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface OwnerProps {
  userId: UniqueEntityID;
  userEmail: string;
  userName: string;
}

export class Owner extends Entity<OwnerProps> {
  public static create(props: OwnerProps, id?: UniqueEntityID) {
    return new Owner(props, id);
  }
}

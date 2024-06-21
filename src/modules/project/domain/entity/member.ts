import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface MemberProps {
  userId: UniqueEntityID;
  projectId: UniqueEntityID;
  userEmail: string;
  userName: string;
}

export class Member extends Entity<MemberProps> {
  public static create(props: MemberProps, id?: UniqueEntityID) {
    return new Member(props, id);
  }
}

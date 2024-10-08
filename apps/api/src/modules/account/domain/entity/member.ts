import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

export interface MemberProps {
  accountId: UniqueEntityID;
}

export class Member extends Entity<MemberProps> {
  public get accountId() {
    return this.props.accountId;
  }

  public static create(props: MemberProps, id?: UniqueEntityID) {
    return new Member(props, id);
  }
}

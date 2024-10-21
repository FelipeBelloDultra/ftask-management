import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

export interface MemberProps {
  accountId: UniqueEntityID;
  projectId: UniqueEntityID;
}

export class Member extends Entity<MemberProps> {
  public get accountId() {
    return this.props.accountId;
  }

  public get projectId() {
    return this.props.projectId;
  }

  public static create(props: MemberProps, id?: UniqueEntityID) {
    return new Member(props, id);
  }
}

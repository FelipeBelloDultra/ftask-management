import { ValueObject } from "@/core/entity/value-object";

export enum ParticipantRoleValues {
  Member = "member",
  Owner = "owner",
}

export class ParticipantRole extends ValueObject<ParticipantRoleValues> {
  public get value() {
    return this.props;
  }

  public static create(props: ParticipantRoleValues): ParticipantRole {
    return new ParticipantRole(props);
  }
}

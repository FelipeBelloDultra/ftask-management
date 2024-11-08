import { ValueObject } from "@/core/entity/value-object";

export enum ParticipantRoleValues {
  Member = "member",
  Owner = "owner",
}

export class ParticipantRole extends ValueObject<ParticipantRoleValues> {
  public get value() {
    return this.props;
  }

  public isOwner() {
    return this.props === ParticipantRoleValues.Owner;
  }

  public static create(props: ParticipantRoleValues): ParticipantRole {
    return new ParticipantRole(props);
  }

  public static createAsOwner() {
    return new ParticipantRole(ParticipantRoleValues.Owner);
  }

  public static createAsMember() {
    return new ParticipantRole(ParticipantRoleValues.Member);
  }
}

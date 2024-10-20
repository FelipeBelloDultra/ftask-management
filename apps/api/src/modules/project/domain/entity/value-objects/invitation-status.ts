import { ValueObject } from "@/core/entity/value-object";

export enum InvitationStatusValues {
  Pending = "pending",
  Accepted = "accepted",
  Declined = "declined",
}

export class InvitationStatus extends ValueObject<InvitationStatusValues> {
  public get value() {
    return this.props;
  }

  public setPending() {
    this.props = InvitationStatusValues.Pending;
  }

  public setAccepted() {
    this.props = InvitationStatusValues.Accepted;
  }

  public setDeclined() {
    this.props = InvitationStatusValues.Declined;
  }

  public canAccept() {
    return this.props === InvitationStatusValues.Pending;
  }

  public canDecline() {
    return this.props === InvitationStatusValues.Pending;
  }

  public static create(value?: InvitationStatusValues) {
    return new InvitationStatus(value || InvitationStatusValues.Pending);
  }
}

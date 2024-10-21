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
    return this.isPending();
  }

  public canDecline() {
    return this.props === InvitationStatusValues.Pending;
  }

  private isPending() {
    return this.props === InvitationStatusValues.Pending;
  }

  private isDeclined() {
    return this.props === InvitationStatusValues.Declined;
  }

  public isBlocked() {
    return this.isDeclined() || this.isPending();
  }

  public static create(value?: InvitationStatusValues) {
    return new InvitationStatus(value || InvitationStatusValues.Pending);
  }
}

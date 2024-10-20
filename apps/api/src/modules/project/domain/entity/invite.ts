import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";

import { DueDate } from "./value-objects/due-date";
import { InvitationStatus } from "./value-objects/invitation-status";

export interface InviteProps {
  expirationDate: DueDate;
  memberId: UniqueEntityID;
  projectId: UniqueEntityID;
  status: InvitationStatus;
  createdAt: Date;
}

export class Invite extends Entity<InviteProps> {
  private static EXPIRATION_INVITE_TIME_IN_DAYS = 1;

  public get expirationDate() {
    return this.props.expirationDate;
  }

  public get memberId() {
    return this.props.memberId;
  }

  public get projectId() {
    return this.props.projectId;
  }

  public get status() {
    return this.props.status;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  private static setExpirationDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + this.EXPIRATION_INVITE_TIME_IN_DAYS);

    return currentDate;
  }

  public canChangeStatus() {
    return this.status.canAccept() || this.status.canDecline();
  }

  public static create(props: Optional<InviteProps, "expirationDate" | "createdAt" | "status">, id?: UniqueEntityID) {
    return new Invite(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        expirationDate: props.expirationDate || DueDate.create(Invite.setExpirationDate()),
        status: props.status || InvitationStatus.create(),
      },
      id,
    );
  }
}

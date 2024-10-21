import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";

import { InviteDetail } from "../entity/value-objects/invite-detail";

export class ProjectInviteWasCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public inviteDetail: InviteDetail;

  public constructor(inviteDetail: InviteDetail) {
    this.inviteDetail = inviteDetail;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.inviteDetail.id;
  }
}

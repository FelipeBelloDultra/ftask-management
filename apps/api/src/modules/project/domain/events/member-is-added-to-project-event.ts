import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { ProjectMemberDetails } from "@/modules/project/domain/entity/project-member-details";

export class MemberIsAddedToProjectEvent implements DomainEvent {
  public ocurredAt: Date;
  public projectMemberDetails: ProjectMemberDetails;

  public constructor(projectMemberDetails: ProjectMemberDetails) {
    this.projectMemberDetails = projectMemberDetails;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.projectMemberDetails.id;
  }
}

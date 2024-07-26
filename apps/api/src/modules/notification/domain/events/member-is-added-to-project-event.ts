import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { DomainEvent } from "~/core/events/domain-event";
import { ProjectMember } from "~/modules/project/domain/entity/project-member";

export class MemberIsAddedToProjectEvent implements DomainEvent {
  public ocurredAt: Date;
  public projectMember: ProjectMember;

  public constructor(projectMember: ProjectMember) {
    this.projectMember = projectMember;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.projectMember.id;
  }
}

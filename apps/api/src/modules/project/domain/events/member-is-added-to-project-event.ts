import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { MemberWithProject } from "@/modules/project/domain/entity/member-with-project";

export class MemberIsAddedToProjectEvent implements DomainEvent {
  public ocurredAt: Date;
  public memberWithProject: MemberWithProject;

  public constructor(memberWithProject: MemberWithProject) {
    this.memberWithProject = memberWithProject;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.memberWithProject.id;
  }
}

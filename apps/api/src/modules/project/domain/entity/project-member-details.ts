import { AggregateRoot } from "@/core/entity/aggregate-root";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Member } from "@/modules/account/domain/entity/member";
import { Project } from "@/modules/project/domain/entity/project";

import { MemberIsAddedToProjectEvent } from "../events/member-is-added-to-project-event";

export interface ProjectMemberDetailsProps {
  project: Project;
  member: Member;
}

export class ProjectMemberDetails extends AggregateRoot<ProjectMemberDetailsProps> {
  public get project() {
    return this.props.project;
  }

  public get member() {
    return this.props.member;
  }

  public static create(props: ProjectMemberDetailsProps, id: UniqueEntityID) {
    const projectMemberDetails = new ProjectMemberDetails(props, id);
    projectMemberDetails.addDomainEvent(new MemberIsAddedToProjectEvent(projectMemberDetails));

    return projectMemberDetails;
  }
}

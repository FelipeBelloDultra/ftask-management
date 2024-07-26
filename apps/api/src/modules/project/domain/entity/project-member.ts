import { AggregateRoot } from "~/core/entity/aggregate-root";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { MemberIsAddedToProjectEvent } from "~/modules/notification/domain/events/member-is-added-to-project-event";

export interface ProjectMemberProps {
  projectId: UniqueEntityID;
  memberId: UniqueEntityID;
}

export class ProjectMember extends AggregateRoot<ProjectMemberProps> {
  public get projectId() {
    return this.props.projectId;
  }

  public get memberId() {
    return this.props.memberId;
  }

  public static create(props: ProjectMemberProps, id?: UniqueEntityID) {
    const projectMember = new ProjectMember(props, id);
    const isNewProjectMember = !id;

    if (isNewProjectMember) {
      projectMember.addDomainEvent(new MemberIsAddedToProjectEvent(projectMember));
    }

    return projectMember;
  }
}

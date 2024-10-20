import { AggregateRoot } from "@/core/entity/aggregate-root";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Member } from "@/modules/account/domain/entity/member";
import { Project } from "@/modules/project/domain/entity/project";
import { MemberIsAddedToProjectEvent } from "@/modules/project/domain/events/member-is-added-to-project-event";

export interface MemberWithProjectProps {
  project: Project;
  member: Member;
}

export class MemberWithProject extends AggregateRoot<MemberWithProjectProps> {
  public get project() {
    return this.props.project;
  }

  public get member() {
    return this.props.member;
  }

  public static create(props: MemberWithProjectProps, id?: UniqueEntityID) {
    const memberWithProject = new MemberWithProject(props, id);
    const isNewMemberInProject = !id;

    if (isNewMemberInProject) {
      memberWithProject.addDomainEvent(new MemberIsAddedToProjectEvent(memberWithProject));
    }

    return memberWithProject;
  }
}

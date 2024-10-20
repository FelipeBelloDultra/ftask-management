import { AggregateRoot } from "@/core/entity/aggregate-root";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Member } from "@/modules/account/domain/entity/member";
import { Project } from "@/modules/project/domain/entity/project";
import { MemberIsAddedToProjectEvent } from "@/modules/project/domain/events/member-is-added-to-project-event";

import { InvitationStatus } from "./value-objects/invitation-status";

export interface MemberWithProjectProps {
  project: Project;
  member: Member;
  invitationStatus: InvitationStatus;
}

export class MemberWithProject extends AggregateRoot<MemberWithProjectProps> {
  public get project() {
    return this.props.project;
  }

  public get member() {
    return this.props.member;
  }

  public get invitationStatus() {
    return this.props.invitationStatus;
  }

  public static create(props: Optional<MemberWithProjectProps, "invitationStatus">, id?: UniqueEntityID) {
    const memberWithProject = new MemberWithProject(
      {
        ...props,
        invitationStatus: props.invitationStatus ?? InvitationStatus.create(),
      },
      id,
    );
    const isNewMemberInProject = !id;

    if (isNewMemberInProject) {
      memberWithProject.addDomainEvent(new MemberIsAddedToProjectEvent(memberWithProject));
    }

    return memberWithProject;
  }
}

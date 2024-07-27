import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

export interface ProjectMemberProps {
  projectId: UniqueEntityID;
  memberId: UniqueEntityID;
}

export class ProjectMember extends Entity<ProjectMemberProps> {
  public get projectId() {
    return this.props.projectId;
  }

  public get memberId() {
    return this.props.memberId;
  }

  public static create(props: ProjectMemberProps, id?: UniqueEntityID) {
    return new ProjectMember(props, id);
  }
}

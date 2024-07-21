import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface ProjectMemberProps {
  projectId: UniqueEntityID;
  memberId: UniqueEntityID;
}

export class ProjectMember {
  private readonly props: ProjectMemberProps;

  private constructor(props: ProjectMemberProps) {
    this.props = props;
  }

  public get projectId() {
    return this.props.projectId;
  }

  public get memberId() {
    return this.props.memberId;
  }

  public static create(props: ProjectMemberProps) {
    return new ProjectMember(props);
  }
}

import { Dto } from "@/core/entity/dto";

interface AddProjectMemberProps {
  projectId: string;
  memberAccountEmail: string;
  ownerAccountId: string;
}

export class AddProjectMemberDto extends Dto<AddProjectMemberProps> {
  public get ownerAccountId() {
    return this.props.ownerAccountId;
  }

  public get projectId() {
    return this.props.projectId;
  }

  public get memberAccountEmail() {
    return this.props.memberAccountEmail;
  }

  public static create(props: AddProjectMemberProps) {
    return new AddProjectMemberDto(props);
  }
}

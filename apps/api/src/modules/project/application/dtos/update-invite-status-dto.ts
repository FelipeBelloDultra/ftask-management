import { Dto } from "@/core/entity/dto";

export enum NewStatusOptions {
  Accept = "accept",
  Reject = "reject",
}

interface UpdateInviteStatusDtoProps {
  inviteId: string;
  newStatus: NewStatusOptions;
  accountId: string;
}

export class UpdateInviteStatusDto extends Dto<UpdateInviteStatusDtoProps> {
  public get inviteId() {
    return this.props.inviteId;
  }

  public get newStatus() {
    return this.props.newStatus;
  }

  public get accountId() {
    return this.props.accountId;
  }

  public static create(props: UpdateInviteStatusDtoProps) {
    return new UpdateInviteStatusDto(props);
  }
}

import { Dto } from "@/core/entity/dto";

interface FetchInvitesByMemberProps {
  memberId: string;
  page: number;
  limit: number;
  status?: "pending" | "accepted" | "declined";
}

export class FetchInvitesByMemberDto extends Dto<FetchInvitesByMemberProps> {
  public get memberId() {
    return this.props.memberId;
  }

  public get page() {
    return this.props.page;
  }

  public get limit() {
    return this.props.limit;
  }

  public get status() {
    return this.props.status;
  }

  public static create(props: FetchInvitesByMemberProps) {
    return new FetchInvitesByMemberDto(props);
  }
}

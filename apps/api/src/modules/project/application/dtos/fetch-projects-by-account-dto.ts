import { Dto } from "@/core/entity/dto";

interface FetchProjectsByAccountProps {
  ownerId: string;
  page: number;
  limit: number;
  role?: "owner" | "member";
}

export class FetchProjectsByAccountDto extends Dto<FetchProjectsByAccountProps> {
  public get ownerId() {
    return this.props.ownerId;
  }

  public get page() {
    return this.props.page;
  }

  public get limit() {
    return this.props.limit;
  }

  public get role() {
    return this.props.role;
  }

  public static create(props: FetchProjectsByAccountProps) {
    return new FetchProjectsByAccountDto(props);
  }
}

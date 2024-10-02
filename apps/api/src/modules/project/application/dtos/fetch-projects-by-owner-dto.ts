import { Dto } from "@/core/entity/dto";

interface FetchProjectsByOwnerProps {
  ownerId: string;
  page: number;
  limit: number;
}

export class FetchProjectsByOwnerDto extends Dto<FetchProjectsByOwnerProps> {
  public get ownerId() {
    return this.props.ownerId;
  }

  public get page() {
    return this.props.page;
  }

  public get limit() {
    return this.props.limit;
  }

  public static create(props: FetchProjectsByOwnerProps) {
    return new FetchProjectsByOwnerDto(props);
  }
}

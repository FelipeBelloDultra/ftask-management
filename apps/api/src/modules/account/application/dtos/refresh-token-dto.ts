import { Dto } from "@/core/entity/dto";

interface RefreshTokenProps {
  refreshToken: string;
}

export class RefreshTokenDto extends Dto<RefreshTokenProps> {
  public get refreshToken() {
    return this.props.refreshToken;
  }

  public static create(props: RefreshTokenProps) {
    return new RefreshTokenDto(props);
  }
}

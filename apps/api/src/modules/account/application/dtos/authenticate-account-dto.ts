import { Dto } from "@/core/entity/dto";

interface AuthenticateAccountProps {
  email: string;
  password: string;
}

export class AuthenticateAccountDto extends Dto<AuthenticateAccountProps> {
  public get email() {
    return this.props.email;
  }

  public get password() {
    return this.props.password;
  }

  public static create(props: AuthenticateAccountProps) {
    return new AuthenticateAccountDto(props);
  }
}

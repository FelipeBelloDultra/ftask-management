import { Dto } from "@/core/entity/dto";

interface CreateAccountProps {
  name: string;
  email: string;
  password: string;
}

export class CreateAccountDto extends Dto<CreateAccountProps> {
  public get name() {
    return this.props.name;
  }

  public get email() {
    return this.props.email;
  }

  public get password() {
    return this.props.password;
  }

  public static create(props: CreateAccountProps) {
    return new CreateAccountDto(props);
  }
}

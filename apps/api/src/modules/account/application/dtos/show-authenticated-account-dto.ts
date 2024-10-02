import { Dto } from "@/core/entity/dto";

interface ShowAuthenticatedAccountProps {
  accountId: string;
}

export class ShowAuthenticatedAccountDto extends Dto<ShowAuthenticatedAccountProps> {
  public get accountId() {
    return this.props.accountId;
  }

  public static create(props: ShowAuthenticatedAccountProps) {
    return new ShowAuthenticatedAccountDto(props);
  }
}

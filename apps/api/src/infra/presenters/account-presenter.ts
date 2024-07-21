import { Account } from "~/modules/account/domain/entity/account";

export class AccountPresenter {
  public static toHTTP(account: Account) {
    return {
      data: {
        id: account.id.toString(),
        email: account.values.email,
        name: account.values.name,
      },
    };
  }
}

import { Account } from "@/modules/account/domain/entity/account";

export class AccountPresenter {
  public static toHTTP(account: Account) {
    return {
      id: account.id.toValue(),
      email: account.values.email,
      name: account.values.name,
    };
  }
}

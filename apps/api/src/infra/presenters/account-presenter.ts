import { Account } from "@/modules/account/domain/entity/account";

export class AccountPresenter {
  public static toHTTP(account: Account) {
    return {
      id: account.id.toValue(),
      picture_url: account.pictureUrl?.getFullUrl() || null,
      email: account.email,
      name: account.name,
    };
  }
}

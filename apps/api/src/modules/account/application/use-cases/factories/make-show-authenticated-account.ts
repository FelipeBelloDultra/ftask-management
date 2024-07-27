import { container } from "tsyringe";

import { ShowAuthenticatedAccountUseCase } from "../show-authenticated-account.use-case";

export function makeShowAuthenticatedAccount() {
  const showAuthenticatedAccount = container.resolve(ShowAuthenticatedAccountUseCase);

  return showAuthenticatedAccount;
}

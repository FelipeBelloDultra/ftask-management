import { container } from "tsyringe";

import { AuthenticateAccountUseCase } from "../authenticate-account.use-case";

export function makeAuthenticateAccount() {
  const authenticateAccount = container.resolve(AuthenticateAccountUseCase);

  return authenticateAccount;
}

import { container } from "tsyringe";

import { CreateAccountUseCase } from "../create-account.use-case";

export function makeCreateAccount() {
  const createAccount = container.resolve(CreateAccountUseCase);

  return createAccount;
}

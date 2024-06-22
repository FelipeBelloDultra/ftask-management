import { UseCaseError } from "~/core/errors/use-case.error";

export class AccountNotFound extends Error implements UseCaseError {
  public constructor() {
    super("Account not found");
    this.name = AccountNotFound.name;
  }
}

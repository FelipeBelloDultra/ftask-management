import { UseCaseError } from "@/core/errors/use-case.error";

export class AccountNotFoundError extends Error implements UseCaseError {
  public constructor() {
    super("Account not found");
    this.name = AccountNotFoundError.name;
  }
}

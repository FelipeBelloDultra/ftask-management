import { UseCaseError } from "@/core/errors/use-case.error";

export class AccountAlreadyExistsError extends Error implements UseCaseError {
  public constructor() {
    super("Account already exists");
    this.name = AccountAlreadyExistsError.name;
  }
}

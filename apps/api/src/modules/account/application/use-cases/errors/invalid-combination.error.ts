import { UseCaseError } from "~/core/errors/use-case.error";

export class InvalidCombinationError extends Error implements UseCaseError {
  public constructor() {
    super("Invalid combination");
    this.name = InvalidCombinationError.name;
  }
}

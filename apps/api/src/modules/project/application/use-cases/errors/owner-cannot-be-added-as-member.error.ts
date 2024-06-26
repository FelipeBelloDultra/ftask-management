import { UseCaseError } from "~/core/errors/use-case.error";

export class OwnerCannotBeAddedAsMemberError extends Error implements UseCaseError {
  public constructor() {
    super("Owner cannot be added as member");
    this.name = OwnerCannotBeAddedAsMemberError.name;
  }
}

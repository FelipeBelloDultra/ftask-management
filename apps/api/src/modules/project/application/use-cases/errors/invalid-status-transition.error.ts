import { UseCaseError } from "@/core/errors/use-case.error";

export class InvalidStatusTransitionError extends Error implements UseCaseError {
  public constructor() {
    super("Invalid status transition");
    this.name = InvalidStatusTransitionError.name;
  }
}

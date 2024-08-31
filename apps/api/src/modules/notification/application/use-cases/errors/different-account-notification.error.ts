import { UseCaseError } from "@/core/errors/use-case.error";

export class DifferentAccountNotificationError extends Error implements UseCaseError {
  public constructor() {
    super("Cannot send notification to different account");
    this.name = DifferentAccountNotificationError.name;
  }
}

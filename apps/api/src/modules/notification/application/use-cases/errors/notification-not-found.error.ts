import { UseCaseError } from "@/core/errors/use-case.error";

export class NotificationNotFoundError extends Error implements UseCaseError {
  public constructor() {
    super("Notification not found");
    this.name = NotificationNotFoundError.name;
  }
}

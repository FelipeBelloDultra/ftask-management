import { UseCaseError } from "@/core/errors/use-case.error";

export class NotificationAlreadyMarkedAsReadError extends Error implements UseCaseError {
  public constructor() {
    super("Notification has already been marked as read");
    this.name = NotificationAlreadyMarkedAsReadError.name;
  }
}

import { container } from "tsyringe";

import { MarkNotificationAsReadUseCase } from "@/modules/notification/application/use-cases/mark-notification-as-read.use-case";

export function makeMarkNotificationAsRead() {
  const markNotificationAsRead = container.resolve(MarkNotificationAsReadUseCase);

  return markNotificationAsRead;
}

import { container } from "tsyringe";

import { ShowNotificationDetailByIdUseCase } from "../show-notification-detail-by-id.use-case";

export function makeShowNotificationDetailById() {
  const showNotificationDetailById = container.resolve(ShowNotificationDetailByIdUseCase);

  return showNotificationDetailById;
}

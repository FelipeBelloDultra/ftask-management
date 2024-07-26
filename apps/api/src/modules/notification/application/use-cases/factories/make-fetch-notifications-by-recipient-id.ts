import { container } from "tsyringe";

import { FetchNotificationsByRecipientIdUseCase } from "../fetch-notifications-by-recipient-id.use-cases";

export function makeFetchNotificationsByRecipientId() {
  const fetchNotificationsByRecipientId = container.resolve(FetchNotificationsByRecipientIdUseCase);

  return fetchNotificationsByRecipientId;
}

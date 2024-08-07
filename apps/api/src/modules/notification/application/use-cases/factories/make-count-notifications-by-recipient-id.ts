import { container } from "tsyringe";

import { CountNotificationsByRecipientIdUseCase } from "../count-notifications-by-recipient-id.use-cases";

export function makeCountNotificationsByRecipientId() {
  const countNotificationsByRecipientId = container.resolve(CountNotificationsByRecipientIdUseCase);

  return countNotificationsByRecipientId;
}

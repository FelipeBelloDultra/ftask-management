import { container } from "tsyringe";

import { SendNotificationUseCase } from "@/modules/notification/application/use-cases/send-notification.use-case";

container.register<SendNotificationUseCase>("SendNotificationUseCase", {
  useClass: SendNotificationUseCase,
});

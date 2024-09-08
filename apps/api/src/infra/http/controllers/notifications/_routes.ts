import { Router } from "express";

import { ensureAuthenticatedMiddleware } from "@/infra/http/middlewares/factories/make-ensure-authenticated";

import { CountNotificationsByRecipientIdController } from "./count-notifications-by-recipient-id.controller";
import { FetchNotificationsByRecipientIdController } from "./fetch-notifications-by-recipient-id.controller";
import { MarkNotificationAsReadController } from "./mark-notification-as-read.controller";
import { ShowNotificationDetailByIdController } from "./show-notification-detail-by-id.controller";

const router = Router();

router.get(
  "/notifications",
  ensureAuthenticatedMiddleware.handle(),
  new FetchNotificationsByRecipientIdController().handler,
);
router.get(
  "/notifications/count",
  ensureAuthenticatedMiddleware.handle(),
  new CountNotificationsByRecipientIdController().handler,
);
router.patch(
  "/notifications/:notificationId/read",
  ensureAuthenticatedMiddleware.handle(),
  new MarkNotificationAsReadController().handler,
);
router.get(
  "/notifications/:notificationId",
  ensureAuthenticatedMiddleware.handle(),
  new ShowNotificationDetailByIdController().handler,
);

export { router };

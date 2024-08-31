import { Router } from "express";

import { ensureAuthenticatedMiddleware } from "@/infra/http/middlewares/factories/make-ensure-authenticated";

import { CountNotificationsByRecipientIdController } from "./count-notifications-by-recipient-id.controller";
import { FetchNotificationsByRecipientIdController } from "./fetch-notifications-by-recipient-id.controller";
import { MarkNotificationAsReadController } from "./mark-notification-as-read.controller";

const router = Router();

router.get(
  "/notifications",
  ensureAuthenticatedMiddleware.handle(),
  new FetchNotificationsByRecipientIdController().handler,
);
router.patch(
  "/notifications/:notificationId/read",
  ensureAuthenticatedMiddleware.handle(),
  new MarkNotificationAsReadController().handler,
);
router.get(
  "/notifications/count",
  ensureAuthenticatedMiddleware.handle(),
  new CountNotificationsByRecipientIdController().handler,
);

export { router };

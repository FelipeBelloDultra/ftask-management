import { Router } from "express";

import { ensureAuthenticatedMiddleware } from "@/infra/http/middlewares/factories/make-ensure-authenticated";

import { CountNotificationsByRecipientIdController } from "./count-notifications-by-recipient-id.controller";
import { FetchNotificationsByRecipientIdController } from "./fetch-notifications-by-recipient-id.controller";

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

export { router };

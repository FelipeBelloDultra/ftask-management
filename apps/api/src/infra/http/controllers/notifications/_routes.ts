import { Router } from "express";

import { ensureAuthenticatedMiddleware } from "@/infra/http/middlewares/factories/make-ensure-authenticated";

import { FetchNotificationsByRecipientIdController } from "./fetch-notifications-by-recipient-id.controller";

const router = Router();

router.get(
  "/notifications",
  ensureAuthenticatedMiddleware.handle(),
  new FetchNotificationsByRecipientIdController().handler,
);

export { router };

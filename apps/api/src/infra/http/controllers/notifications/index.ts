import { Router } from "express";

import { Controller } from "@/infra/http/controller";

import { FetchNotificationsByRecipientIdController } from "./fetch-notifications-by-recipient-id.controller";

const fetchNotificationsByRecipientIdController = new FetchNotificationsByRecipientIdController();

export class NotificationRoutes {
  private readonly controllers: Array<Controller> = [fetchNotificationsByRecipientIdController];
  public readonly router = Router();

  public constructor() {
    this.controllers.forEach((routeController) => {
      routeController.registerRoute();

      this.router.use(routeController.router);
    });
  }
}

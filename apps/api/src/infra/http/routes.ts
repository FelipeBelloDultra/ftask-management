import { Router } from "express";

import { router as accountRouter } from "./controllers/account/_routes";
import { router as notificationRouter } from "./controllers/notifications/_routes";
import { router as projectRouter } from "./controllers/project/_routes";

export class Routes {
  private readonly routes = [projectRouter, accountRouter, notificationRouter];
  public readonly router = Router();

  public constructor() {
    this.routes.forEach((router) => {
      this.router.use(router);
    });
  }
}

import { Router } from "express";

import { AccountRoutes } from "./controllers/account";
import { NotificationRoutes } from "./controllers/notifications";
import { ProjectRoutes } from "./controllers/project";

const projectRoutes = new ProjectRoutes();
const notificationRoutes = new NotificationRoutes();
const accountRoutes = new AccountRoutes();

export class Routes {
  private readonly routes = [projectRoutes, accountRoutes, notificationRoutes];
  public readonly router = Router();

  public constructor() {
    this.routes.forEach((routeConfig) => {
      this.router.use(routeConfig.router);
    });
  }
}

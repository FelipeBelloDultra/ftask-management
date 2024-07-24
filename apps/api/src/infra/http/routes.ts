import { Router } from "express";

import { AccountRoutes } from "./controllers/account";
import { ProjectRoutes } from "./controllers/project";

const projectRoutes = new ProjectRoutes();
const accountRoutes = new AccountRoutes();

export class Routes {
  private readonly routes = [projectRoutes, accountRoutes];
  public readonly router = Router();

  public constructor() {
    this.routes.forEach((routeConfig) => {
      this.router.use(routeConfig.router);
    });
  }
}

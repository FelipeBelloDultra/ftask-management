import { Router } from "express";

import { Controller } from "./controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { Middleware } from "./middleware";
import { makeEnsureAuthenticated } from "./middlewares/factories/make-ensure-authenticated";

const createAccountController = new CreateAccountController();
const ensureAuthenticated = makeEnsureAuthenticated();

export class Routes {
  private readonly routesControllers: Array<{ controller: Controller; middlewares?: Array<Middleware> }> = [
    {
      controller: createAccountController,
      middlewares: [ensureAuthenticated],
    },
  ];
  public readonly router = Router();

  public constructor() {
    this.routesControllers.forEach((routeController) => {
      routeController.controller.registerRoute(routeController.middlewares);

      this.router.use(routeController.controller.router);
    });
  }
}

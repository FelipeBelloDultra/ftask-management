import { Router } from "express";

import { Controller } from "./controller";
import { CreateAccountController } from "./controllers/create-account.controller";

const createAccountController = new CreateAccountController();

export class Routes {
  private readonly controllers: Array<Controller> = [createAccountController];
  public readonly router = Router();

  public constructor() {
    this.controllers.forEach((controller) => {
      controller.registerRoute();

      this.router.use(controller.router);
    });
  }
}

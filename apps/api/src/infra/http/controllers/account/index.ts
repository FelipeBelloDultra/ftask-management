import { Router } from "express";

import { Controller } from "@/infra/http/controller";

import { AuthenticateAccountController } from "./authenticate-account.controller";
import { CreateAccountController } from "./create-account.controller";
import { ShowAuthenticatedAccountController } from "./show-authenticated-account.controller";

const createAccountController = new CreateAccountController();
const authenticateAccountController = new AuthenticateAccountController();
const showAuthenticatedAccountController = new ShowAuthenticatedAccountController();

export class AccountRoutes {
  private readonly controllers: Array<Controller> = [
    createAccountController,
    authenticateAccountController,
    showAuthenticatedAccountController,
  ];
  public readonly router = Router();

  public constructor() {
    this.controllers.forEach((routeController) => {
      routeController.registerRoute();

      this.router.use(routeController.router);
    });
  }
}

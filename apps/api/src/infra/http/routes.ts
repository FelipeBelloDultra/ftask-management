import { Router } from "express";

import { Controller } from "./controller";
import { AddProjectMemberController } from "./controllers/add-project-member.controller";
import { AuthenticateAccountController } from "./controllers/authenticate-account.controller";
import { CreateAccountController } from "./controllers/create-account.controller";

const createAccountController = new CreateAccountController();
const authenticateAccountController = new AuthenticateAccountController();
const addProjectMemberController = new AddProjectMemberController();

export class Routes {
  private readonly controllers: Array<Controller> = [
    createAccountController,
    authenticateAccountController,
    addProjectMemberController,
  ];
  public readonly router = Router();

  public constructor() {
    this.controllers.forEach((routeController) => {
      routeController.registerRoute();

      this.router.use(routeController.router);
    });
  }
}

import { Router } from "express";

import { Controller } from "./controller";
import { AddProjectMemberController } from "./controllers/add-project-member.controller";
import { AuthenticateAccountController } from "./controllers/authenticate-account.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateProjectController } from "./controllers/create-project.controller";
import { CreateTaskController } from "./controllers/create-task.controller";

const createAccountController = new CreateAccountController();
const authenticateAccountController = new AuthenticateAccountController();
const addProjectMemberController = new AddProjectMemberController();
const createProjectController = new CreateProjectController();
const createTaskController = new CreateTaskController();

export class Routes {
  private readonly controllers: Array<Controller> = [
    createAccountController,
    authenticateAccountController,
    addProjectMemberController,
    createProjectController,
    createTaskController,
  ];
  public readonly router = Router();

  public constructor() {
    this.controllers.forEach((routeController) => {
      routeController.registerRoute();

      this.router.use(routeController.router);
    });
  }
}

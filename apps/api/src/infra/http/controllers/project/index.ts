import { Router } from "express";

import { Controller } from "@/infra/http/controller";

import { AddProjectMemberController } from "./add-project-member.controller";
import { CreateProjectController } from "./create-project.controller";
import { CreateTaskController } from "./create-task.controller";

const addProjectMemberController = new AddProjectMemberController();
const createProjectController = new CreateProjectController();
const createTaskController = new CreateTaskController();

export class ProjectRoutes {
  private readonly controllers: Array<Controller> = [
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

import { Router } from "express";

import { ensureAuthenticatedMiddleware } from "@/infra/http/middlewares/factories/make-ensure-authenticated";

import { AddProjectMemberController } from "./add-project-member.controller";
import { CreateProjectController } from "./create-project.controller";
import { CreateTaskController } from "./create-task.controller";
import { FetchProjectsByAccountController } from "./fetch-projects-by-owner.controller";

const router = Router();

router.post(
  "/projects/:projectId/member",
  ensureAuthenticatedMiddleware.handle(),
  new AddProjectMemberController().handler,
);
router.post("/projects", ensureAuthenticatedMiddleware.handle(), new CreateProjectController().handler);
router.post("/projects/:projectId/task", ensureAuthenticatedMiddleware.handle(), new CreateTaskController().handler);
router.get("/projects", ensureAuthenticatedMiddleware.handle(), new FetchProjectsByAccountController().handler);

export { router };

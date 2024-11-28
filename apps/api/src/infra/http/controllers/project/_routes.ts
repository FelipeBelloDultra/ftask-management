import { Router } from "express";

import { ensureAuthenticatedMiddleware } from "@/infra/http/middlewares/factories/make-ensure-authenticated";
import { uploadSingleFileMiddleware } from "@/infra/http/middlewares/factories/make-upload-single-file";

import { AddProjectMemberController } from "./add-project-member.controller";
import { CreateProjectController } from "./create-project.controller";
import { CreateTaskController } from "./create-task.controller";
import { FetchProjectsByAccountController } from "./fetch-projects-by-account.controller";
import { UpdateInviteStatusController } from "./update-invite-status.controller";
import { UploadProjectIconController } from "./upload-project-icon.controller";

const router = Router();

router.post(
  "/projects/:projectId/member",
  ensureAuthenticatedMiddleware.handle(),
  new AddProjectMemberController().handler,
);
router.post("/projects", ensureAuthenticatedMiddleware.handle(), new CreateProjectController().handler);
router.post("/projects/:projectId/task", ensureAuthenticatedMiddleware.handle(), new CreateTaskController().handler);
router.get("/projects", ensureAuthenticatedMiddleware.handle(), new FetchProjectsByAccountController().handler);
router.patch(
  "/projects/:projectId/upload/icon",
  ensureAuthenticatedMiddleware.handle(),
  uploadSingleFileMiddleware.handle("icon"),
  new UploadProjectIconController().handler,
);
router.patch(
  "/projects/:projectId/invites/:inviteId/:inviteStatus",
  ensureAuthenticatedMiddleware.handle(),
  new UpdateInviteStatusController().handler,
);
router.get("/projects/:projectId/invites", (req, res) => {
  return res
    .json({
      message: "Not implemented yet",
      status: 501,
      error: {
        message: "Not implemented yet",
      },
    })
    .status(501);
});

export { router };

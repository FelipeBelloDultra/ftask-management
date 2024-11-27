import { Router } from "express";

import { ensureAuthenticatedMiddleware } from "@/infra/http/middlewares/factories/make-ensure-authenticated";
import { uploadSingleFileMiddleware } from "@/infra/http/middlewares/factories/make-upload-single-file";

import { AuthenticateAccountController } from "./authenticate-account.controller";
import { CreateAccountController } from "./create-account.controller";
import { FetchInvitesByMemberController } from "./fetch-invites-by-member.controller";
import { RefreshTokenController } from "./refresh-token.controller";
import { ShowAuthenticatedAccountController } from "./show-authenticated-account.controller";
import { UploadAccountPictureController } from "./upload-account-picture.controller";

const router = Router();

router.post("/account/session", new AuthenticateAccountController().handler);
router.post("/account", new CreateAccountController().handler);
router.patch("/account/session/refresh-token", new RefreshTokenController().handler);
router.get(
  "/account/session/me",
  ensureAuthenticatedMiddleware.handle(),
  new ShowAuthenticatedAccountController().handler,
);
router.patch(
  "/account/upload/picture",
  ensureAuthenticatedMiddleware.handle(),
  uploadSingleFileMiddleware.handle("picture"),
  new UploadAccountPictureController().handler,
);
router.get("/account/invites", ensureAuthenticatedMiddleware.handle(), new FetchInvitesByMemberController().handler);

export { router };

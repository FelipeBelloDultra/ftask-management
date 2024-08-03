import { Router } from "express";

import { ensureAuthenticatedMiddleware } from "@/infra/http/middlewares/factories/make-ensure-authenticated";

import { AuthenticateAccountController } from "./authenticate-account.controller";
import { CreateAccountController } from "./create-account.controller";
import { RefreshTokenController } from "./refresh-token.controller";
import { ShowAuthenticatedAccountController } from "./show-authenticated-account.controller";
import { UploadAccountIconController } from "./upload-account-icon.controller";

const router = Router();

// multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 2 * 1024 * 1024, // limit file size to 2MB
//   },
// }).single("file"),

router.post("/account/session", new AuthenticateAccountController().handler);
router.post("/account", new CreateAccountController().handler);
router.patch("/account/session/refresh-token", new RefreshTokenController().handler);
router.get(
  "/account/session/me",
  ensureAuthenticatedMiddleware.handle(),
  new ShowAuthenticatedAccountController().handler,
);
router.patch("/account/upload/icon", new UploadAccountIconController().handler);

export { router };

import { Router } from "express";
// import multer from "multer";

import { Controller } from "@/infra/http/controller";

import { AuthenticateAccountController } from "./authenticate-account.controller";
import { CreateAccountController } from "./create-account.controller";
import { RefreshTokenController } from "./refresh-token.controller";
import { ShowAuthenticatedAccountController } from "./show-authenticated-account.controller";
// import { UploadAccountIconController } from "./upload-account-icon.controller";

const createAccountController = new CreateAccountController();
const authenticateAccountController = new AuthenticateAccountController();
const showAuthenticatedAccountController = new ShowAuthenticatedAccountController();
const refreshTokenController = new RefreshTokenController();
// const uploadAccountIconController = new UploadAccountIconController();

export class AccountRoutes {
  private readonly controllers: Array<Controller> = [
    createAccountController,
    authenticateAccountController,
    showAuthenticatedAccountController,
    refreshTokenController,
    // uploadAccountIconController,
  ];
  public readonly router = Router();

  public constructor() {
    // uploadAccountIconController.registerRoute();
    // this.router.use(
    //   ,
    //   uploadAccountIconController.router,
    // );

    this.controllers.forEach((routeController) => {
      routeController.registerRoute();

      this.router.use(routeController.router);
    });
  }
}

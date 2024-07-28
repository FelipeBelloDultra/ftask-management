import { Request, Response } from "express";

import { Controller, ControllerMethods } from "@/infra/http/controller";
import { HttpException } from "@/infra/http/http-exception";
import { makeEnsureAuthenticated } from "@/infra/http/middlewares/factories/make-ensure-authenticated";
import { AccountPresenter } from "@/infra/presenters/account-presenter";
import { makeShowAuthenticatedAccount } from "@/modules/account/application/use-cases/factories/make-show-authenticated-account";
import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";

export class ShowAuthenticatedAccountController extends Controller {
  public constructor() {
    super({
      method: ControllerMethods.GET,
      path: "/account/session/me",
      middlewares: [makeEnsureAuthenticated()],
    });
  }

  public async handler(req: Request, res: Response): Promise<Response> {
    const { id } = req.account;

    const showAuthenticatedAccount = makeShowAuthenticatedAccount();
    const result = await showAuthenticatedAccount.execute({
      accountId: id,
    });

    if (result.isRight()) {
      return res.status(200).json({
        data: AccountPresenter.toHTTP(result.value.account),
      });
    }

    switch (result.value.constructor) {
      case AccountNotFoundError:
        throw new HttpException({
          message: "Forbidden",
          statusCode: 403,
        });
      default:
        throw new Error();
    }
  }
}

import { Request, Response } from "express";
import { container } from "tsyringe";

import { Controller, ControllerMethods } from "@/infra/http/controller";
import { EnsureAuthenticatedMiddleware } from "@/infra/http/middlewares/ensure-authenticated.middleware";
import { AccountPresenter } from "@/infra/presenters/account-presenter";
import { makeShowAuthenticatedAccount } from "@/modules/account/application/use-cases/factories/make-show-authenticated-account";
import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";

import { HttpException } from "../../http-exception";

export class ShowAuthenticatedAccountController extends Controller {
  public constructor() {
    super({
      method: ControllerMethods.GET,
      path: "/account/session/me",
      middlewares: [container.resolve(EnsureAuthenticatedMiddleware)],
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

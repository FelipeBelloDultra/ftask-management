import { Request, Response } from "express";
import { container } from "tsyringe";

import { Controller, ControllerMethods } from "@/infra/http/controller";
import { HttpException } from "@/infra/http/http-exception";
import { EnsureAuthenticatedMiddleware } from "@/infra/http/middlewares/ensure-authenticated.middleware";
import { NotificationPresenter } from "@/infra/presenters/notification-presenter";
import { makeFetchNotificationsByRecipientId } from "@/modules/notification/application/use-cases/factories/make-fetch-notifications-by-recipient-id";
import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";

export class FetchNotificationsByRecipientIdController extends Controller {
  public constructor() {
    super({
      path: "/notifications",
      method: ControllerMethods.GET,
      middlewares: [container.resolve(EnsureAuthenticatedMiddleware)],
    });
  }

  public async handler(req: Request, res: Response): Promise<Response> {
    const { id } = req.account;

    const fetchNotificationsByRecipientId = makeFetchNotificationsByRecipientId();

    const result = await fetchNotificationsByRecipientId.execute({
      recipientId: id,
    });

    if (result.isRight()) {
      return res.status(200).json({
        data: result.value.notifications.map(NotificationPresenter.toHTTP),
      });
    }

    switch (result.value.constructor) {
      case AccountNotFoundError:
        throw new HttpException({
          message: "Account not found",
          statusCode: 404,
        });
      default:
        throw new Error();
    }
  }
}

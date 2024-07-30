import { Request, Response } from "express";
import { z } from "zod";

import { Controller, ControllerMethods } from "@/infra/http/controller";
import { makeEnsureAuthenticated } from "@/infra/http/middlewares/factories/make-ensure-authenticated";
import { NotificationPresenter } from "@/infra/presenters/notification-presenter";
import { makeFetchNotificationsByRecipientId } from "@/modules/notification/application/use-cases/factories/make-fetch-notifications-by-recipient-id";

const paramSchema = z.object({
  page: z.string().optional().default("1").transform(Number).pipe(z.number().min(1)),
  limit: z.string().optional().default("10").transform(Number).pipe(z.number().min(10)),
});

export class FetchNotificationsByRecipientIdController extends Controller {
  public constructor() {
    super({
      path: "/notifications",
      method: ControllerMethods.GET,
      middlewares: [makeEnsureAuthenticated()],
    });
  }

  public async handler(req: Request, res: Response): Promise<Response> {
    const { limit, page } = paramSchema.parse(req.params);
    const { id } = req.account;

    const fetchNotificationsByRecipientId = makeFetchNotificationsByRecipientId();

    const result = await fetchNotificationsByRecipientId.execute({
      recipientId: id,
      limit,
      page,
    });

    if (result.isRight()) {
      return res.status(200).json({
        data: {
          notifications: result.value.notifications.map(NotificationPresenter.toHTTP),
          total: result.value.total,
        },
      });
    }

    throw new Error();
  }
}

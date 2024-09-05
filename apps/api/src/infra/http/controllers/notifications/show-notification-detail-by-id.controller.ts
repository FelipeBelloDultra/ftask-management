import { Request, Response } from "express";
import { z } from "zod";

import { Controller } from "@/infra/http/controller";
import { NotificationDetailPresenter } from "@/infra/presenters/notificaiton-detail-presenter";
import { makeShowNotificationDetailById } from "@/modules/notification/application/use-cases/factories/make-show-notificiation-detail-by-id";

const routeParamSchema = z.object({
  notificationId: z.string().uuid(),
});

export class ShowNotificationDetailByIdController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { notificationId } = routeParamSchema.parse(req.params);
    const { id } = req.account;

    const showNotificationDetailById = makeShowNotificationDetailById();

    const result = await showNotificationDetailById.execute({
      recipientId: id,
      notificationId,
    });

    if (result.isRight()) {
      return res.status(200).json({
        data: NotificationDetailPresenter.toHTTP(result.value.notificationDetail),
      });
    }
  }
}

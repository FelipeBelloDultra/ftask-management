import { Request, Response } from "express";
import { z } from "zod";

import { Controller } from "@/infra/http/controller";
import { NotificationDetailPresenter } from "@/infra/presenters/notificaiton-detail-presenter";
import { ShowNotificationDetailByIdDto } from "@/modules/notification/application/dtos/show-notification-detail-by-id-dto";
import { NotificationNotFoundError } from "@/modules/notification/application/use-cases/errors/notification-not-found.error";
import { makeShowNotificationDetailById } from "@/modules/notification/application/use-cases/factories/make-show-notificiation-detail-by-id";

import { HttpException } from "../../http-exception";

const routeParamSchema = z.object({
  notificationId: z.string().uuid(),
});

export class ShowNotificationDetailByIdController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { notificationId } = routeParamSchema.parse(req.params);
    const { id } = req.account;

    const showNotificationDetailById = makeShowNotificationDetailById();

    const result = await showNotificationDetailById.execute(
      ShowNotificationDetailByIdDto.create({
        recipientId: id,
        notificationId,
      }),
    );

    if (result.isRight()) {
      return res.status(200).json({
        data: NotificationDetailPresenter.toHTTP(result.value.notificationDetail),
      });
    }

    switch (result.value.constructor) {
      case NotificationNotFoundError:
        throw new HttpException({
          message: "Notification not found",
          statusCode: 404,
        });
    }

    throw new Error();
  }
}

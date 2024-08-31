import { Request, Response } from "express";
import { z } from "zod";

import { Controller } from "@/infra/http/controller";
import { DifferentAccountNotificationError } from "@/modules/notification/application/use-cases/errors/different-account-notification.error";
import { NotificationAlreadyMarkedAsReadError } from "@/modules/notification/application/use-cases/errors/notification-already-marked-as-read.error";
import { NotificationNotFoundError } from "@/modules/notification/application/use-cases/errors/notification-not-found.error";
import { makeMarkNotificationAsRead } from "@/modules/notification/application/use-cases/factories/make-mark-notification-as-read";

import { HttpException } from "../../http-exception";

const routeParamSchema = z.object({
  notificationId: z.string().uuid(),
});

export class MarkNotificationAsReadController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { notificationId } = routeParamSchema.parse(req.params);
    const { id } = req.account;

    const markNotificationAsRead = makeMarkNotificationAsRead();

    const result = await markNotificationAsRead.execute({
      recipientId: id,
      notificationId,
    });

    if (result.isRight()) {
      return res.status(204).send();
    }

    switch (result.value.constructor) {
      case NotificationNotFoundError:
        throw new HttpException({
          message: `Notification ${notificationId} not found`,
          statusCode: 404,
        });
      case DifferentAccountNotificationError:
        throw new HttpException({
          message: "You cannot mark this notification as read",
          statusCode: 403,
        });
      case NotificationAlreadyMarkedAsReadError:
        throw new HttpException({
          message: "This notification has already been marked as read",
          statusCode: 400,
        });
    }

    throw new Error();
  }
}

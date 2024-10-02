import { Request, Response } from "express";
import { z } from "zod";

import { Controller } from "@/infra/http/controller";
import { NotificationPresenter } from "@/infra/presenters/notification-presenter";
import { PaginationPresenter } from "@/infra/presenters/pagination-presenter";
import { FetchNotificationsByRecipientIdDto } from "@/modules/notification/application/dtos/fetch-notifications-by-recipient-id-dto";
import { makeFetchNotificationsByRecipientId } from "@/modules/notification/application/use-cases/factories/make-fetch-notifications-by-recipient-id";

const paramSchema = z.object({
  page: z.string().optional().default("1").transform(Number).pipe(z.number().min(1)),
  limit: z.string().optional().default("10").transform(Number).pipe(z.number().min(5)),
  read: z
    .string()
    .optional()
    .transform((x) => {
      if (x?.toLowerCase() === "true") return true;
      if (x?.toLowerCase() === "false") return false;

      return undefined;
    }),
});

export class FetchNotificationsByRecipientIdController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { limit, page, read } = paramSchema.parse(req.query);
    const { id } = req.account;

    const fetchNotificationsByRecipientId = makeFetchNotificationsByRecipientId();

    const result = await fetchNotificationsByRecipientId.execute(
      FetchNotificationsByRecipientIdDto.create({
        recipientId: id,
        limit,
        page,
        read,
      }),
    );

    if (result.isRight()) {
      return res.status(200).json({
        data: {
          notifications: result.value.notifications.map(NotificationPresenter.toHTTP),
          pagination: PaginationPresenter.toHTTP({
            items: result.value.notifications,
            pagination: result.value.pagination,
            total: result.value.total,
          }),
        },
      });
    }

    throw new Error();
  }
}

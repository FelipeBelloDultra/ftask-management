import { Request, Response } from "express";
import { z } from "zod";

import { Controller } from "@/infra/http/controller";
import { CountNotificationsByRecipientIdDto } from "@/modules/notification/application/dtos/count-notifications-by-recipient-id-dto";
import { makeCountNotificationsByRecipientId } from "@/modules/notification/application/use-cases/factories/make-count-notifications-by-recipient-id";

const paramSchema = z.object({
  read: z
    .string()
    .toLowerCase()
    .default("true")
    .transform((x) => x === "true")
    .pipe(z.boolean()),
});

export class CountNotificationsByRecipientIdController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { read } = paramSchema.parse(req.query);
    const { id } = req.account;

    const countNotificationsByRecipientId = makeCountNotificationsByRecipientId();

    const result = await countNotificationsByRecipientId.execute(
      CountNotificationsByRecipientIdDto.create({
        recipientId: id,
        read,
      }),
    );

    if (result.isRight()) {
      return res.status(200).json({
        data: {
          total: result.value.total,
        },
      });
    }

    throw new Error();
  }
}

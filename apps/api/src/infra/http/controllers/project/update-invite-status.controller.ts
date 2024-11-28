import { Request, Response } from "express";
import { z } from "zod";

import { NewStatusOptions, UpdateInviteStatusDto } from "@/modules/project/application/dtos/update-invite-status-dto";
import { ExpiredInviteError } from "@/modules/project/application/use-cases/errors/expired-invite.error";
import { InvalidStatusTransitionError } from "@/modules/project/application/use-cases/errors/invalid-status-transition.error";
import { InviteNotFoundError } from "@/modules/project/application/use-cases/errors/invite-not-found.error";
import { NotAllowedError } from "@/modules/project/application/use-cases/errors/not-allowed.error";
import { makeUpdateInviteStatus } from "@/modules/project/application/use-cases/factories/make-update-invite-status";

import { Controller } from "../../controller";
import { HttpException } from "../../http-exception";

const routeParamSchema = z.object({
  projectId: z.string().uuid(),
  inviteId: z.string().uuid(),
  inviteStatus: z.union([z.literal(NewStatusOptions.Accept), z.literal(NewStatusOptions.Reject)]),
});

export class UpdateInviteStatusController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { projectId, inviteId, inviteStatus } = routeParamSchema.parse(req.params);
    const { id } = req.account;

    const updateInviteStatus = makeUpdateInviteStatus();

    const result = await updateInviteStatus.execute(
      UpdateInviteStatusDto.create({
        accountId: id,
        inviteId,
        projectId,
        newStatus: inviteStatus,
      }),
    );

    if (result.isRight()) {
      return res.status(204).send();
    }

    switch (result.value.constructor) {
      case InviteNotFoundError:
        throw new HttpException({
          message: "Invite not found",
          statusCode: 404,
        });
      case ExpiredInviteError:
        throw new HttpException({
          message: "Cannot update invite status because it has expired",
          statusCode: 409,
        });
      case InvalidStatusTransitionError:
        throw new HttpException({
          message: "Invalid status transition",
          statusCode: 400,
        });
      case NotAllowedError:
        throw new HttpException({
          message: "Forbidden",
          statusCode: 403,
        });
      default:
        throw new Error();
    }
  }
}

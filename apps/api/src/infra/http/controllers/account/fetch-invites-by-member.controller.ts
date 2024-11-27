import { Request, Response } from "express";
import { z } from "zod";

import { Controller } from "@/infra/http/controller";
import { InviteWithProjectPresenter } from "@/infra/presenters/invite-with-project-presenter";
import { PaginationPresenter } from "@/infra/presenters/pagination-presenter";
import { FetchInvitesByMemberDto } from "@/modules/project/application/dtos/fetch-invites-by-member-dto";
import { makeFetchInvitesByMember } from "@/modules/project/application/use-cases/factories/make-fetch-invites-by-member";

const paramSchema = z.object({
  status: z.union([z.literal("pending"), z.literal("accepted"), z.literal("declined")]).optional(),
  page: z.string().optional().default("1").transform(Number).pipe(z.number().min(1)),
  limit: z.string().optional().default("10").transform(Number).pipe(z.number().min(5)),
});

export class FetchInvitesByMemberController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { limit, page, status } = paramSchema.parse(req.query);
    const { id } = req.account;

    const fetchInvitesByMember = makeFetchInvitesByMember();

    const result = await fetchInvitesByMember.execute(
      FetchInvitesByMemberDto.create({
        memberId: id,
        status,
        limit,
        page,
      }),
    );

    if (result.isRight()) {
      return res.status(200).json({
        data: {
          invites: result.value.invites.map((inviteWithProject) =>
            InviteWithProjectPresenter.toHTTP(inviteWithProject),
          ),
          pagination: PaginationPresenter.toHTTP({
            items: result.value.invites,
            pagination: result.value.pagination,
            total: result.value.total,
          }),
        },
      });
    }

    throw new Error();
  }
}

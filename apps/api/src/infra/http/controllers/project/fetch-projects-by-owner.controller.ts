import { Request, Response } from "express";
import { z } from "zod";

import { Controller } from "@/infra/http/controller";
import { PaginationPresenter } from "@/infra/presenters/pagination-presenter";
import { ProjectPresenter } from "@/infra/presenters/project-presenter";
import { FetchProjectsByAccountDto } from "@/modules/project/application/dtos/fetch-projects-by-account-dto";
import { makeFetchProjectsByAccount } from "@/modules/project/application/use-cases/factories/make-fetch-projects-by-account";

const paramSchema = z.object({
  role: z.union([z.literal("owner"), z.literal("member")]).optional(),
  page: z.string().optional().default("1").transform(Number).pipe(z.number().min(1)),
  limit: z.string().optional().default("10").transform(Number).pipe(z.number().min(5)),
});

export class FetchProjectsByAccountController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { limit, page, role } = paramSchema.parse(req.query);
    const { id } = req.account;

    const fetchProjectsByAccount = makeFetchProjectsByAccount();

    const result = await fetchProjectsByAccount.execute(
      FetchProjectsByAccountDto.create({
        ownerId: id,
        role,
        limit,
        page,
      }),
    );

    if (result.isRight()) {
      return res.status(200).json({
        data: {
          projects: result.value.projects.map(ProjectPresenter.toHTTP),
          pagination: PaginationPresenter.toHTTP({
            items: result.value.projects,
            pagination: result.value.pagination,
            total: result.value.total,
          }),
        },
      });
    }

    throw new Error();
  }
}

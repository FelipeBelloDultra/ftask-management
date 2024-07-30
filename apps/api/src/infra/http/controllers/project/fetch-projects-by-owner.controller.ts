import { Request, Response } from "express";
import { z } from "zod";

import { Controller, ControllerMethods } from "@/infra/http/controller";
import { makeEnsureAuthenticated } from "@/infra/http/middlewares/factories/make-ensure-authenticated";
import { PaginationPresenter } from "@/infra/presenters/pagination-presenter";
import { ProjectPresenter } from "@/infra/presenters/project-presenter";
import { makeFetchProjectsByOwner } from "@/modules/project/application/use-cases/factories/make-fetch-projects-by-owner";

const paramSchema = z.object({
  page: z.string().optional().default("1").transform(Number).pipe(z.number().min(1)),
  limit: z.string().optional().default("10").transform(Number).pipe(z.number().min(5)),
});

export class FetchProjectsByOwnerController extends Controller {
  public constructor() {
    super({
      path: "/projects",
      method: ControllerMethods.GET,
      middlewares: [makeEnsureAuthenticated()],
    });
  }

  public async handler(req: Request, res: Response): Promise<Response> {
    const { limit, page } = paramSchema.parse(req.query);
    const { id } = req.account;

    const fetchProjectsByOwner = makeFetchProjectsByOwner();

    const result = await fetchProjectsByOwner.execute({
      ownerId: id,
      limit,
      page,
    });

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

import { Request, Response } from "express";
import { z } from "zod";

import { Controller } from "@/infra/http/controller";
import { HttpException } from "@/infra/http/http-exception";
import { ProjectPresenter } from "@/infra/presenters/project-presenter";
import { CreateProjectDto } from "@/modules/project/application/dtos/create-project-dto";
import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";
import { DuplicatedProjectSlugError } from "@/modules/project/application/use-cases/errors/duplicated-project-slug.error";
import { makeCreateProject } from "@/modules/project/application/use-cases/factories/make-create-project";

const schema = z.object({
  name: z.string().min(5).max(255),
  description: z.string().min(15).max(255).nullable().default(null),
  due_date: z.coerce
    .date()
    .refine((date) => date.getTime() > new Date().getTime(), {
      message: "Due date must be in the future",
    })
    .nullable()
    .default(null),
});

export class CreateProjectController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { name, description, due_date } = schema.parse(req.body);
    const { id } = req.account;

    const createProject = makeCreateProject();

    const result = await createProject.execute(
      CreateProjectDto.create({
        ownerAccountId: id,
        name,
        description,
        dueDate: due_date,
      }),
    );

    if (result.isRight()) {
      return res.status(201).json({
        data: ProjectPresenter.toHTTP(result.value.project, id),
      });
    }

    switch (result.value.constructor) {
      case AccountNotFoundError:
        throw new HttpException({
          message: "Account not found",
          statusCode: 404,
        });
      case DuplicatedProjectSlugError:
        throw new HttpException({
          message: "Choose another project name",
          statusCode: 409,
        });
      default:
        throw new Error();
    }
  }
}

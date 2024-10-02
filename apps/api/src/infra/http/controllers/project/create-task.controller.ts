import { Request, Response } from "express";
import { z } from "zod";

import { Controller } from "@/infra/http/controller";
import { HttpException } from "@/infra/http/http-exception";
import { TaskPresenter } from "@/infra/presenters/task-presenter";
import { CreateTaskDto } from "@/modules/project/application/dtos/create-task-dto";
import { NotAllowedError } from "@/modules/project/application/use-cases/errors/not-allowed.error";
import { ProjectMemberNotFoundError } from "@/modules/project/application/use-cases/errors/project-member-not-found.error";
import { ProjectNotFoundError } from "@/modules/project/application/use-cases/errors/project-not-found.error";
import { makeCreateTask } from "@/modules/project/application/use-cases/factories/make-create-task";

const schema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(15).max(255),
  assignee_id: z.string().uuid(),
  due_date: z.coerce.date().refine((date) => date.getTime() > new Date().getTime(), {
    message: "Due date must be in the future",
  }),
});
const routeParamSchema = z.object({
  projectId: z.string().uuid(),
});

export class CreateTaskController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { description, due_date, title, assignee_id } = schema.parse(req.body);
    const { projectId } = routeParamSchema.parse(req.params);
    const { id } = req.account;

    const createTask = makeCreateTask();

    const result = await createTask.execute(
      CreateTaskDto.create({
        title,
        description,
        dueDate: due_date,
        assigneeId: assignee_id,
        ownerAccountId: id,
        projectId,
      }),
    );

    if (result.isRight()) {
      return res.status(201).json({
        data: TaskPresenter.toHTTP(result.value.task),
      });
    }

    switch (result.value.constructor) {
      case ProjectNotFoundError:
        throw new HttpException({
          message: `Project ${projectId} not found`,
          statusCode: 404,
        });
      case NotAllowedError:
        throw new HttpException({
          message: "Not allowed",
          statusCode: 403,
        });
      case ProjectMemberNotFoundError:
        throw new HttpException({
          message: "Assignee not found",
          statusCode: 404,
        });
      default:
        throw new Error();
    }
  }
}

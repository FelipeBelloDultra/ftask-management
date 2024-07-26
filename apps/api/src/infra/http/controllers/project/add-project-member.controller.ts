import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { Controller, ControllerMethods } from "@/infra/http/controller";
import { HttpException } from "@/infra/http/http-exception";
import { EnsureAuthenticatedMiddleware } from "@/infra/http/middlewares/ensure-authenticated.middleware";
import { ProjectMemberPresenter } from "@/infra/presenters/project-member-presenter";
import { MemberNotFoundError } from "@/modules/project/application/use-cases/errors/member-not-found.error";
import { NotAllowedError } from "@/modules/project/application/use-cases/errors/not-allowed.error";
import { OwnerCannotBeAddedAsMemberError } from "@/modules/project/application/use-cases/errors/owner-cannot-be-added-as-member.error";
import { ProjectMemberAlreadyExistsError } from "@/modules/project/application/use-cases/errors/project-member-already-exists.error";
import { ProjectNotFoundError } from "@/modules/project/application/use-cases/errors/project-not-found.error";
import { makeAddProjectMember } from "@/modules/project/application/use-cases/factories/make-add-project-member";

const schema = z.object({
  member_email: z.string().email().min(6).max(255),
});
const routeParamSchema = z.object({
  projectId: z.string().uuid(),
});

export class AddProjectMemberController extends Controller {
  public constructor() {
    super({
      method: ControllerMethods.POST,
      path: "/projects/:projectId/member",
      middlewares: [container.resolve(EnsureAuthenticatedMiddleware)],
    });
  }

  public async handler(req: Request, res: Response): Promise<Response> {
    const { member_email } = schema.parse(req.body);
    const { projectId } = routeParamSchema.parse(req.params);
    const { id } = req.account;

    const addProjectMember = makeAddProjectMember();

    const result = await addProjectMember.execute({
      memberAccountEmail: member_email,
      ownerAccountId: id,
      projectId: projectId,
    });

    if (result.isRight()) {
      return res.status(201).json(ProjectMemberPresenter.toHTTP(result.value.projectMember));
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
      case MemberNotFoundError:
        throw new HttpException({
          message: `Account with email ${member_email} not found`,
          statusCode: 404,
        });
      case OwnerCannotBeAddedAsMemberError:
        throw new HttpException({
          message: "Owner cannot be added as a member",
          statusCode: 403,
        });
      case ProjectMemberAlreadyExistsError:
        throw new HttpException({
          message: "Project member already exists",
          statusCode: 409,
        });
      default:
        throw new Error();
    }
  }
}

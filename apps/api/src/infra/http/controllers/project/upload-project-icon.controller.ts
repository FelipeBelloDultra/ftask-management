import { Request, Response } from "express";
import { z } from "zod";

import { ProjectPresenter } from "@/infra/presenters/project-presenter";
import { InvalidAccountPictureTypeError } from "@/modules/account/application/use-cases/errors/invalid-account-picture-type.error";
import { UploadAndSaveProjectIconUrlDto } from "@/modules/project/application/dtos/upload-and-save-project-icon-url-dto";
import { NotAllowedError } from "@/modules/project/application/use-cases/errors/not-allowed.error";
import { ProjectNotFoundError } from "@/modules/project/application/use-cases/errors/project-not-found.error";
import { makeUploadAndSaveProjectIconUrl } from "@/modules/project/application/use-cases/factories/make-upload-and-save-project-icon-url";

import { Controller } from "../../controller";
import { HttpException } from "../../http-exception";

const routeParamSchema = z.object({
  projectId: z.string().uuid(),
});

export class UploadProjectIconController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { buffer, originalname, mimetype } = req.file as { buffer: Buffer; originalname: string; mimetype: string };
    const { projectId } = routeParamSchema.parse(req.params);
    const { id } = req.account;

    const uploadAndSaveProjectIconUrl = makeUploadAndSaveProjectIconUrl();
    const result = await uploadAndSaveProjectIconUrl.execute(
      UploadAndSaveProjectIconUrlDto.create({
        projectId,
        accountId: id,
        fileName: originalname,
        fileType: mimetype,
        body: buffer,
      }),
    );

    if (result.isRight()) {
      return res.status(200).json({
        data: ProjectPresenter.toHTTP(result.value.project),
      });
    }

    switch (result.value.constructor) {
      case InvalidAccountPictureTypeError:
        throw new HttpException({
          statusCode: 400,
          message: "Invalid account picture type",
          errors: [{ message: "Invalid account picture type" }],
        });
      case NotAllowedError:
        throw new HttpException({
          message: "Forbidden",
          statusCode: 403,
        });
      case ProjectNotFoundError:
        throw new HttpException({
          message: "Project not found",
          statusCode: 404,
        });
    }

    throw new Error();
  }
}

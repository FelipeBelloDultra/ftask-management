import { Request, Response } from "express";

import { Controller } from "@/infra/http/controller";
import { AccountPresenter } from "@/infra/presenters/account-presenter";
import { InvalidAccountPictureTypeError } from "@/modules/account/application/use-cases/errors/invalid-account-picture-type.error";
import { makeUploadAndSaveAccountPictureUseCase } from "@/modules/account/application/use-cases/factories/make-upload-and-save-account-picture";
import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";

import { HttpException } from "../../http-exception";

export class UploadAccountPictureController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { buffer, originalname, mimetype } = req.file as { buffer: Buffer; originalname: string; mimetype: string };
    const { id } = req.account;

    const uploadAndSaveAccountPicture = makeUploadAndSaveAccountPictureUseCase();
    const result = await uploadAndSaveAccountPicture.execute({
      accountId: id,
      fileName: originalname,
      fileType: mimetype,
      body: buffer,
    });

    if (result.isRight()) {
      return res.status(200).json({
        data: AccountPresenter.toHTTP(result.value.account),
      });
    }

    switch (result.value.constructor) {
      case InvalidAccountPictureTypeError:
        throw new HttpException({
          statusCode: 400,
          message: "Invalid account picture type",
          errors: [{ message: "Invalid account picture type" }],
        });
      case AccountNotFoundError:
        throw new HttpException({
          message: "Forbidden",
          statusCode: 403,
        });
    }

    throw new Error();
  }
}

import { Request, Response } from "express";

import { Controller } from "@/infra/http/controller";
import { makeUploadAndSaveAccountPictureUseCase } from "@/modules/account/application/use-cases/factories/make-upload-and-save-account-picture";

export class UploadAccountPictureController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const { buffer, originalname, mimetype } = req.file as { buffer: Buffer; originalname: string; mimetype: string };
    // const { id } = req.account;

    const uploadAndSaveAccountPicture = makeUploadAndSaveAccountPictureUseCase();
    const result = await uploadAndSaveAccountPicture.execute({
      accountId: "8d446bf6-68c4-4e9d-92cf-924053e512d1", // Replace with actual account ID
      fileName: originalname,
      fileType: mimetype,
      body: buffer,
    });

    return res.json({ ok: JSON.stringify(result.value) });
  }
}

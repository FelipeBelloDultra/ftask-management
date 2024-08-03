import { Request, Response } from "express";

import { Controller } from "@/infra/http/controller";

export class UploadAccountPictureController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    console.log(req.file);

    return res.json({ ok: true });
  }
}

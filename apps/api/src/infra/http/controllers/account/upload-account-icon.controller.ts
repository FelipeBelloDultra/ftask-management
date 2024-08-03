import { Request, Response } from "express";

import { Controller } from "@/infra/http/controller";

export class UploadAccountIconController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    return res.json({ ok: true });
  }
}

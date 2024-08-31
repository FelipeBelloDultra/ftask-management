import { Request, Response } from "express";

import { Controller } from "@/infra/http/controller";

export class MarkNotificationAsReadController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    console.log(req, res);

    throw new Error("Not implemented");
  }
}

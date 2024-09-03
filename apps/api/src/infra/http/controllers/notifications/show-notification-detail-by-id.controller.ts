import { Request, Response } from "express";

import { Controller } from "@/infra/http/controller";

export class ShowNotificationDetailByIdController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    throw new Error("Method not implemented.");
  }
}

import { Request, Response, Router } from "express";

import { Controller } from "../controller";

export class CreateAccountController implements Controller {
  public readonly router = Router();
  public readonly PATH = "/account";

  public registerRoute() {
    this.router.post(this.PATH, this.handler.bind(this));
  }

  public async handler(req: Request, res: Response) {
    console.log(req.body);

    return res.status(201).send();
  }
}

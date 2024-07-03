import { Request, Response, Router } from "express";

import { Middleware } from "./middleware";

export interface Controller {
  registerRoute(middlewares?: Array<Middleware>): void;
  handler(req: Request, res: Response): Promise<Response>;
  readonly router: Router;
  readonly PATH: string;
}

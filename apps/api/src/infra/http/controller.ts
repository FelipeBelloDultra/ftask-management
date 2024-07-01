import { Request, Response, Router } from "express";

export interface Controller {
  registerRoute(): void;
  handler(req: Request, res: Response): Promise<Response>;
  readonly router: Router;
  readonly PATH: string;
}

import { Request, Response } from "express";

export interface Controller {
  handler(req: Request, res: Response): Promise<Response>;
}

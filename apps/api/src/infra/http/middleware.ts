import { NextFunction, Request, Response } from "express";

type MiddlewareReturnType = void | Response | NextFunction | Promise<void> | Promise<Response> | Promise<NextFunction>;

export interface Middleware {
  handle(): (req: Request, res: Response, next: NextFunction) => MiddlewareReturnType;
}

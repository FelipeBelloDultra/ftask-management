import { Request, RequestHandler, Response, Router } from "express";

import { Middleware } from "./middleware";

export enum ControllerMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
  ALL = "all",
}

export interface ControllerConstructor {
  middlewares?: Array<Middleware>;
  method: ControllerMethods;
  path: string;
}

export abstract class Controller {
  public readonly router = Router();
  public readonly middlewares?: Array<Middleware>;
  private readonly path: string;
  private readonly method: ControllerMethods;

  public constructor({ middlewares, method, path }: ControllerConstructor) {
    this.middlewares = middlewares || [];
    this.path = path;
    this.method = method;
  }

  public registerRoute() {
    const handlers: Array<RequestHandler> = [];

    if (this.middlewares?.length) {
      handlers.push(...this.middlewares.map((middleware) => middleware.handler()));
    }

    handlers.push(this.handler.bind(this));

    this.router[this.method](this.path, ...handlers);
  }

  public abstract handler(req: Request, res: Response): Promise<Response>;
}

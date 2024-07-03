import { Request, RequestHandler, Response, Router } from "express";

import { Middleware } from "./middleware";

export interface ControllerConstructor {
  middlewares?: Array<Middleware>;
}

export enum ControllerMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
  ALL = "all",
}

export abstract class Controller {
  public readonly router = Router();
  public readonly middlewares?: Array<Middleware>;
  public abstract readonly PATH: string;
  public abstract readonly METHOD: ControllerMethods;

  public constructor({ middlewares }: ControllerConstructor = { middlewares: [] }) {
    this.middlewares = middlewares;
  }

  public registerRoute() {
    const handlers: Array<RequestHandler> = [];

    if (this.middlewares?.length) {
      handlers.push(...this.middlewares.map((middleware) => middleware.handler()));
    }

    handlers.push(this.handler.bind(this));

    this.router[this.METHOD](this.PATH, ...handlers);
  }

  public abstract handler(req: Request, res: Response): Promise<Response>;
}

import { Request, Response, Router } from "express";

interface ControllerExceptionFormat {
  message: string;
  statusCode: number;
  errors?: Array<{
    [key: string]: string | Array<string>;
  }>;
}

export interface Controller {
  registerRoute(): void;
  handler(req: Request, res: Response): Promise<Response>;
  readonly router: Router;
  readonly PATH: string;
}

export class ControllerException extends Error {
  public readonly errors: ControllerExceptionFormat["errors"];
  public readonly statusCode: ControllerExceptionFormat["statusCode"];

  public constructor({ message, statusCode, errors }: ControllerExceptionFormat) {
    super(message);
    this.name = ControllerException.name;
    this.errors = errors;
    this.statusCode = statusCode;
  }
}

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";

import { HttpException } from "../http-exception";
import { Middleware } from "../middleware";

@injectable()
export class EnsureAuthenticatedMiddleware implements Middleware {
  public constructor(
    @inject("JwtProvider")
    private readonly jwtProvider: JwtProvider,
  ) {}

  public handler() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new HttpException({
          message: "JWT token is missing",
          statusCode: 401,
        });
      }

      const [, token] = authHeader.split(" ");

      try {
        const decoded = await this.jwtProvider.decrypt<{ sub: string }>(token);

        const { sub } = decoded;

        req.account = {
          id: sub,
        };

        return next();
      } catch (error) {
        throw new HttpException({
          message: "JWT token is invalid",
          statusCode: 401,
        });
      }
    };
  }
}

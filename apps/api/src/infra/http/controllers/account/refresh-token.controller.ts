import { Request, Response } from "express";
import { z } from "zod";

import { Controller } from "@/infra/http/controller";
import { InvalidRefreshToken } from "@/modules/account/application/use-cases/errors/invalid-refresh-token.error";
import { makeRefreshToken } from "@/modules/account/application/use-cases/factories/make-refresh-token";

import { HttpException } from "../../http-exception";

const schemaCookie = z.object({
  refresh_token: z.string(),
});

export class RefreshTokenController implements Controller {
  public async handler(req: Request, res: Response): Promise<Response> {
    const parsedCookies = schemaCookie.safeParse(req.cookies);

    if (!parsedCookies.success) {
      throw new HttpException({
        message: "Unauthorized",
        statusCode: 401,
      });
    }

    const { refresh_token } = parsedCookies.data;
    const refreshToken = makeRefreshToken();
    const result = await refreshToken.execute({ refreshToken: refresh_token });

    if (result.isRight()) {
      return res
        .cookie("refresh_token", result.value.refreshToken, {
          path: "/",
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .json({
          data: {
            token: result.value.accessToken,
          },
        });
    }

    switch (result.value.constructor) {
      case InvalidRefreshToken:
        throw new HttpException({
          message: "Invalid refresh token",
          statusCode: 401,
        });
    }

    throw new Error();
  }
}

import { Request, Response } from "express";
import { z } from "zod";

import { InvalidCombinationError } from "~/modules/account/application/use-cases/errors/invalid-combination.error";
import { makeAuthenticateAccount } from "~/modules/account/application/use-cases/factories/make-authenticate-account";

import { Controller, ControllerMethods } from "../controller";
import { HttpException } from "../http-exception";

const schema = z.object({
  email: z.string().email().min(6).max(255),
  password: z.string().min(6).max(255),
});

export class AuthenticateAccountController extends Controller {
  public constructor() {
    super({
      method: ControllerMethods.POST,
      path: "/account/session",
    });
  }

  public async handler(req: Request, res: Response) {
    const { email, password } = schema.parse(req.body);

    const authenticateAccount = makeAuthenticateAccount();
    const result = await authenticateAccount.execute({
      email,
      password,
    });

    if (result.isRight()) {
      const { accessToken, refreshToken } = result.value;

      return res
        .cookie("refresh_token", refreshToken, {
          path: "/",
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .json({
          data: {
            token: accessToken,
          },
        });
    }

    if (result.value instanceof InvalidCombinationError) {
      throw new HttpException({
        message: "Incorrect email/password combination",
        statusCode: 403,
      });
    }

    throw new Error();
  }
}

import { Request, Response } from "express";
import { z } from "zod";

import { Controller } from "@/infra/http/controller";
import { HttpException } from "@/infra/http/http-exception";
import { AccountPresenter } from "@/infra/presenters/account-presenter";
import { AuthenticateAccountDto } from "@/modules/account/application/dtos/authenticate-account-dto";
import { InvalidCombinationError } from "@/modules/account/application/use-cases/errors/invalid-combination.error";
import { makeAuthenticateAccount } from "@/modules/account/application/use-cases/factories/make-authenticate-account";

const schema = z.object({
  email: z.string().email().min(6).max(255),
  password: z.string().min(6).max(255),
});

export class AuthenticateAccountController implements Controller {
  public async handler(req: Request, res: Response) {
    const { email, password } = schema.parse(req.body);

    const authenticateAccount = makeAuthenticateAccount();
    const result = await authenticateAccount.execute(
      AuthenticateAccountDto.create({
        email,
        password,
      }),
    );

    if (result.isRight()) {
      const { accessToken, refreshToken, account } = result.value;

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
            user: AccountPresenter.toHTTP(account),
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

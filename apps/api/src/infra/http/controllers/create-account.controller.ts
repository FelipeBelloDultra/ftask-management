import { Request, Response } from "express";
import { z } from "zod";

import { AccountPresenter } from "~/infra/presenters/account-presenter";
import { AccountAlreadyExistsError } from "~/modules/account/application/use-cases/errors/account-already-exists.error";
import { makeCreateAccount } from "~/modules/account/application/use-cases/factories/make-create-account";

import { Controller, ControllerMethods } from "../controller";
import { HttpException } from "../http-exception";

const schema = z.object({
  name: z.string().min(6).max(255),
  email: z.string().email().min(6).max(255),
  password: z.string().min(6).max(255),
});

export class CreateAccountController extends Controller {
  public constructor() {
    super({
      path: "/account",
      method: ControllerMethods.POST,
    });
  }

  public async handler(req: Request, res: Response) {
    const { email, name, password } = schema.parse(req.body);

    const createAccount = makeCreateAccount();
    const result = await createAccount.execute({
      email,
      name,
      password,
    });

    if (result.isRight()) {
      return res.status(201).json(AccountPresenter.toHTTP(result.value.account));
    }

    if (result.value instanceof AccountAlreadyExistsError) {
      throw new HttpException({
        message: "Email already used",
        statusCode: 409,
        errors: [{ message: "Email already used" }],
      });
    }

    throw new Error();
  }
}

import { Request, Response, Router } from "express";
import { z } from "zod";

import { AccountAlreadyExistsError } from "~/modules/account/application/use-cases/errors/account-already-exists.error";
import { makeCreateAccount } from "~/modules/account/application/use-cases/factories/make-create-account";

import { Controller, ControllerException } from "../controller";

const schema = z.object({
  name: z.string().min(6).max(255),
  email: z.string().email().min(6).max(255),
  password: z.string().min(6).max(255),
});

export class CreateAccountController implements Controller {
  public readonly router = Router();
  public readonly PATH = "/account";

  public registerRoute() {
    this.router.post(this.PATH, this.handler.bind(this));
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
      return res.status(201).send();
    }

    if (result.value instanceof AccountAlreadyExistsError) {
      throw new ControllerException({
        message: "Email already used",
        statusCode: 409,
        errors: [{ message: "Email already used" }],
      });
    }

    throw new Error();
  }
}

import { Either, left, right } from "~/core/either";
import { Account } from "~/modules/account/domain/entity/account";
import { Password } from "~/modules/account/domain/entity/value-objects/password";

import { AccountRepository } from "../repositories/account.repository";

import { AccountAlreadyExistsError } from "./errors/account-already-exists.error";

type Input = {
  name: string;
  email: string;
  password: string;
};
type OnError = AccountAlreadyExistsError;
type OnSuccess = { account: Account };
type Output = Either<OnError, OnSuccess>;

export class CreateAccountUseCase {
  public constructor(private readonly accountRepository: AccountRepository) {}

  public async execute(input: Input): Promise<Output> {
    const existingAccount = await this.accountRepository.findByEmail(input.email);
    if (existingAccount) {
      return left(new AccountAlreadyExistsError());
    }

    const account = Account.create({
      email: input.email,
      name: input.name,
      password: Password.create(input.password, false),
    });
    await this.accountRepository.create(account);

    return right({ account });
  }
}

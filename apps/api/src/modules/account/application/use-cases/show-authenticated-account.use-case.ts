import { inject, injectable } from "tsyringe";

import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Account } from "@/modules/account/domain/entity/account";
import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";

import { AccountRepository } from "../repositories/account.repository";

type Input = {
  accountId: string;
};
type OnError = AccountNotFoundError;
type OnSuccess = {
  account: Account;
};
type Output = Either<OnError, OnSuccess>;

@injectable()
export class ShowAuthenticatedAccountUseCase {
  public constructor(
    @inject("AccountRepository")
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute({ accountId }: Input): Promise<Output> {
    const account = await this.accountRepository.findById(UniqueEntityID.create(accountId));
    if (!account) {
      return left(new AccountNotFoundError());
    }

    return right({ account });
  }
}

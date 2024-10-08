import { inject, injectable } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { Either, left, right } from "@/core/either";
import { AccountRepository } from "@/modules/account/application/repositories/account.repository";
import { Account } from "@/modules/account/domain/entity/account";

import { AuthenticateAccountDto } from "../dtos/authenticate-account-dto";

import { InvalidCombinationError } from "./errors/invalid-combination.error";

type OnError = InvalidCombinationError;
type OnSuccess = {
  accessToken: string;
  refreshToken: string;
  account: Account;
};
type Output = Either<OnError, OnSuccess>;

@injectable()
export class AuthenticateAccountUseCase {
  public constructor(
    @inject("AccountRepository")
    private readonly accountRepository: AccountRepository,
    @inject("JwtProvider")
    private readonly jwtProvider: JwtProvider,
  ) {}

  public async execute(input: AuthenticateAccountDto): Promise<Output> {
    const account = await this.accountRepository.findByEmail(input.email);
    if (!account) {
      return left(new InvalidCombinationError());
    }

    const passwordMatch = await account.password.comparePassword(input.password);
    if (!passwordMatch) {
      return left(new InvalidCombinationError());
    }

    const signature = {
      sub: account.id.toValue(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtProvider.encrypt(signature),
      this.jwtProvider.encrypt(signature, "30d"),
    ]);

    return right({
      accessToken,
      refreshToken,
      account,
    });
  }
}

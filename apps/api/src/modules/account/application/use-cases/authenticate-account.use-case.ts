import { inject, injectable } from "tsyringe";

import { AccountRepository } from "~/account/application/repositories/account.repository";
import { JwtProvider } from "~/application/providers/jwt.provider";
import { Either, left, right } from "~/core/either";

import { InvalidCombinationError } from "./errors/invalid-combination.error";

type Input = {
  email: string;
  password: string;
};
type OnError = InvalidCombinationError;
type OnSuccess = {
  accessToken: string;
  refreshToken: string;
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

  public async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.findByEmail(input.email);
    if (!account) {
      return left(new InvalidCombinationError());
    }

    const passwordMatch = await account.values.password.comparePassword(input.password);
    if (!passwordMatch) {
      return left(new InvalidCombinationError());
    }

    const signature = {
      id: account.id.toValue(),
      email: account.values.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtProvider.encrypt(signature),
      this.jwtProvider.encrypt(signature, "30d"),
    ]);

    return right({
      accessToken,
      refreshToken,
    });
  }
}

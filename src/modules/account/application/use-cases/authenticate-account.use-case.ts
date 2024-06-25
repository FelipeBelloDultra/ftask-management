import { Either, left, right } from "~/core/either";
import { AccountRepository } from "~/account/application/repositories/account.repository";
import { CryptographyProvider } from "~/application/providers/cryptography.provider";

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

export class AuthenticateAccountUseCase {
  public constructor(
    private readonly accountRepository: AccountRepository,
    private readonly cryptographyProvider: CryptographyProvider,
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
      this.cryptographyProvider.encrypt(signature),
      this.cryptographyProvider.encrypt(signature, "30d"),
    ]);

    return right({
      accessToken,
      refreshToken,
    });
  }
}

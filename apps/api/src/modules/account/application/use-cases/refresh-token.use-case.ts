import { inject, injectable } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { Either, left, right } from "@/core/either";

import { InvalidRefreshToken } from "./errors/invalid-refresh-token.error";

type Input = {
  refreshToken: string;
};
type OnError = InvalidRefreshToken;
type OnSuccess = {
  accessToken: string;
  refreshToken: string;
};
type Output = Either<OnError, OnSuccess>;

@injectable()
export class RefreshTokenUseCase {
  public constructor(
    @inject("JwtProvider")
    private readonly jwtProvider: JwtProvider,
  ) {}

  public async execute(input: Input): Promise<Output> {
    try {
      const signature = await this.jwtProvider.decrypt<{ sub: string }>(input.refreshToken);

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtProvider.encrypt({ sub: signature }),
        this.jwtProvider.encrypt({ sub: signature }, "30d"),
      ]);

      return right({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return left(new InvalidRefreshToken());
    }
  }
}

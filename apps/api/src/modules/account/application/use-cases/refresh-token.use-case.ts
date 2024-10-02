import { inject, injectable } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { Either, left, right } from "@/core/either";

import { RefreshTokenDto } from "../dtos/refresh-token-dto";

import { InvalidRefreshToken } from "./errors/invalid-refresh-token.error";

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

  public async execute(input: RefreshTokenDto): Promise<Output> {
    try {
      const signature = await this.jwtProvider.decrypt<{ sub: string }>(input.refreshToken);

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtProvider.encrypt({ sub: signature.sub }),
        this.jwtProvider.encrypt({ sub: signature.sub }, "30d"),
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

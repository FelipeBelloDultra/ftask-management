import { container } from "tsyringe";

import { RefreshTokenUseCase } from "../refresh-token.use-case";

export function makeRefreshToken() {
  const refreshToken = container.resolve(RefreshTokenUseCase);

  return refreshToken;
}

import { UseCaseError } from "@/core/errors/use-case.error";

export class InvalidRefreshToken extends Error implements UseCaseError {
  public constructor() {
    super("Invalid refresh token");
    this.name = InvalidRefreshToken.name;
  }
}

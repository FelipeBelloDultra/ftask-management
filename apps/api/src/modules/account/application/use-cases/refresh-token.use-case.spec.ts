import { FakeJwtProvider } from "@/test/providers/fake-jwt.provider";

import { RefreshTokenDto } from "../dtos/refresh-token-dto";

import { InvalidRefreshToken } from "./errors/invalid-refresh-token.error";
import { RefreshTokenUseCase } from "./refresh-token.use-case";

describe("RefreshTokenUseCase", () => {
  let sut: RefreshTokenUseCase;
  let fakeJwtProvider: FakeJwtProvider;

  beforeEach(() => {
    fakeJwtProvider = new FakeJwtProvider();
    sut = new RefreshTokenUseCase(fakeJwtProvider);
  });

  it("should be able to refresh token", async () => {
    const result = await sut.execute(
      RefreshTokenDto.create({
        refreshToken: "refresh-token",
      }),
    );

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });

  it("should not be to refresh token if token is invalid", async () => {
    const result = await sut.execute(
      RefreshTokenDto.create({
        refreshToken: "throwError",
      }),
    );

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidRefreshToken);
  });
});

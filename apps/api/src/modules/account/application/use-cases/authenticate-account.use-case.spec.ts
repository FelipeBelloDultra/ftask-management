import { Password } from "@/modules/account/domain/entity/value-objects/password";
import { makeAccount } from "@/test/factories/make-account";
import { FakeJwtProvider } from "@/test/providers/fake-jwt.provider";
import { FakeAccountRepository } from "@/test/repositories/fake-account.repository";

import { AuthenticateAccountUseCase } from "./authenticate-account.use-case";
import { InvalidCombinationError } from "./errors/invalid-combination.error";

describe("AuthenticateAccountUseCase", () => {
  let sut: AuthenticateAccountUseCase;
  let fakeAccountRepository: FakeAccountRepository;
  let fakeJwtProvider: FakeJwtProvider;

  beforeEach(() => {
    fakeAccountRepository = new FakeAccountRepository();
    fakeJwtProvider = new FakeJwtProvider();

    sut = new AuthenticateAccountUseCase(fakeAccountRepository, fakeJwtProvider);
  });

  it("should be able to authenticate an account", async () => {
    const account = makeAccount({
      password: Password.create("account-password"),
    });
    await fakeAccountRepository.create(account);

    const input = {
      email: account.values.email,
      password: "account-password",
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });

  it("should not be able to authenticate an account with wrong email", async () => {
    const input = {
      email: "invalid-email",
      password: "account-password",
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCombinationError);
  });

  it("should not be able to authenticate an account with wrong password", async () => {
    const account = makeAccount({
      email: "account-email",
    });
    await fakeAccountRepository.create(account);

    const input = {
      email: "account-email",
      password: "invalid-password",
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCombinationError);
  });
});

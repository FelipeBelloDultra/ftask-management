import { makeAccount } from "@/test/factories/make-account";
import { FakeAccountRepository } from "@/test/repositories/fake-account.repository";

import { CreateAccountUseCase } from "./create-account.use-case";
import { AccountAlreadyExistsError } from "./errors/account-already-exists.error";

describe("CreateAccountUseCase", () => {
  let sut: CreateAccountUseCase;
  let fakeAccountRepository: FakeAccountRepository;

  beforeEach(() => {
    fakeAccountRepository = new FakeAccountRepository();
    sut = new CreateAccountUseCase(fakeAccountRepository);
  });

  it("should be able to create a new account", async () => {
    const PASSWORD = "password";
    const account = makeAccount();

    const input = {
      name: account.values.name,
      email: account.values.email,
      password: "password",
    };
    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(fakeAccountRepository.accounts.length).toBe(1);
    await expect(fakeAccountRepository.accounts[0].values.password.getHashed()).resolves.not.toBe(PASSWORD);
  });

  it("should not be able to create a new account with an existing email", async () => {
    const account = makeAccount();
    await fakeAccountRepository.create(account);

    const input = {
      name: "account-name",
      email: account.values.email,
      password: "account-password",
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountAlreadyExistsError);
    expect(fakeAccountRepository.accounts.length).toBe(1);
  });
});

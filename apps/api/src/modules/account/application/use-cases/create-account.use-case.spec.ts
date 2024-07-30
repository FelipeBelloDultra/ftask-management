import { makeAccount } from "@/test/factories/make-account";
import { InMemoryAccountRepository } from "@/test/repositories/in-memory-account.repository";

import { CreateAccountUseCase } from "./create-account.use-case";
import { AccountAlreadyExistsError } from "./errors/account-already-exists.error";

describe("CreateAccountUseCase", () => {
  let sut: CreateAccountUseCase;
  let inMemoryAccountRepository: InMemoryAccountRepository;

  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    sut = new CreateAccountUseCase(inMemoryAccountRepository);
  });

  it("should be able to create a new account", async () => {
    const PASSWORD = "password";
    const account = makeAccount();

    const input = {
      name: account.name,
      email: account.email,
      password: "password",
    };
    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAccountRepository.accounts.length).toBe(1);
    await expect(inMemoryAccountRepository.accounts[0].password.getHashed()).resolves.not.toBe(PASSWORD);
  });

  it("should not be able to create a new account with an existing email", async () => {
    const account = makeAccount();
    await inMemoryAccountRepository.create(account);

    const input = {
      name: "account-name",
      email: account.email,
      password: "account-password",
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountAlreadyExistsError);
    expect(inMemoryAccountRepository.accounts.length).toBe(1);
  });
});

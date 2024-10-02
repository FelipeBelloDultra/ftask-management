import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";
import { makeAccount } from "@/test/factories/make-account";
import { InMemoryAccountRepository } from "@/test/repositories/in-memory-account.repository";

import { ShowAuthenticatedAccountDto } from "../dtos/show-authenticated-account-dto";

import { ShowAuthenticatedAccountUseCase } from "./show-authenticated-account.use-case";

describe("ShowAuthenticatedAccount", () => {
  let sut: ShowAuthenticatedAccountUseCase;
  let inMemoryAccountRepository: InMemoryAccountRepository;

  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    sut = new ShowAuthenticatedAccountUseCase(inMemoryAccountRepository);
  });

  it("should show the authenticated account", async () => {
    const account = makeAccount();
    await inMemoryAccountRepository.create(account);

    const result = await sut.execute(
      ShowAuthenticatedAccountDto.create({
        accountId: account.id.toValue(),
      }),
    );

    expect(result.isRight()).toBeTruthy();
  });

  it("should not show the authenticated account if account does not exists", async () => {
    const result = await sut.execute(
      ShowAuthenticatedAccountDto.create({
        accountId: "invalid-id",
      }),
    );

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFoundError);
  });
});

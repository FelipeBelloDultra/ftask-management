import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";
import { makeAccount } from "@/test/factories/make-account";
import { FakeAccountRepository } from "@/test/repositories/fake-account.repository";

import { ShowAuthenticatedAccountUseCase } from "./show-authenticated-account.use-case";

describe("ShowAuthenticatedAccount", () => {
  let sut: ShowAuthenticatedAccountUseCase;
  let fakeAccountRepository: FakeAccountRepository;

  beforeEach(() => {
    fakeAccountRepository = new FakeAccountRepository();
    sut = new ShowAuthenticatedAccountUseCase(fakeAccountRepository);
  });

  it("should show the authenticated account", async () => {
    const account = makeAccount();
    await fakeAccountRepository.create(account);

    const result = await sut.execute({ accountId: account.id.toValue() });

    expect(result.isRight()).toBeTruthy();
  });

  it("should not show the authenticated account if account does not exists", async () => {
    const result = await sut.execute({ accountId: "invalid-id" });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFoundError);
  });
});

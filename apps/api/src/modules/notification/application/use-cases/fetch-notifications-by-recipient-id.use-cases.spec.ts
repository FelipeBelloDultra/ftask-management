import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";
import { makeAccount } from "@/test/factories/make-account";
import { makeNotification } from "@/test/factories/make-notification";
import { FakeAccountRepository } from "@/test/repositories/fake-account.repository";
import { FakeNotificationRepository } from "@/test/repositories/fake-notification.repository";

import { FetchNotificationsByRecipientIdUseCase } from "./fetch-notifications-by-recipient-id.use-cases";

describe("FetchNotificationsByRecipientId", () => {
  let sut: FetchNotificationsByRecipientIdUseCase;
  let fakeNotificationRepository: FakeNotificationRepository;
  let fakeAccountRepository: FakeAccountRepository;

  beforeEach(() => {
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeAccountRepository = new FakeAccountRepository();
    sut = new FetchNotificationsByRecipientIdUseCase(fakeNotificationRepository, fakeAccountRepository);
  });

  it("should fetch notifications by recipient id", async () => {
    const account = makeAccount();
    await fakeAccountRepository.create(account);
    const notifications = Array.from({ length: 10 }, () =>
      makeNotification({
        recipientId: account.id,
      }),
    );

    await Promise.all(notifications.map((n) => fakeNotificationRepository.create(n)));

    const result = await sut.execute({ recipientId: account.id.toValue() });

    expect(result.isRight()).toBeTruthy();
  });

  it("should return an error if account not found", async () => {
    const input = { recipientId: "non-existing-account-id" };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFoundError);
  });
});

import { Right } from "@/core/either";
import { Notification } from "@/modules/notification/domain/entity/notification";
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
    const NOTIFICATIONS_LENGTH = 21;
    const account = makeAccount();
    await fakeAccountRepository.create(account);
    const notifications = Array.from({ length: NOTIFICATIONS_LENGTH }, () =>
      makeNotification({
        recipientId: account.id,
      }),
    );

    await Promise.all(notifications.map((n) => fakeNotificationRepository.create(n)));

    const result = (await sut.execute({ recipientId: account.id.toValue(), limit: 10, page: 1 })) as Right<
      never,
      { notifications: Notification[]; total: number }
    >;

    expect(result.isRight()).toBeTruthy();
    expect(result.value.notifications.length).toBe(10);
    expect(result.value.total).toBe(NOTIFICATIONS_LENGTH);
  });

  it("should return an error if account not found", async () => {
    const input = { recipientId: "non-existing-account-id", limit: 10, page: 1 };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFoundError);
  });
});

import { Right } from "@/core/either";
import { Notification } from "@/modules/notification/domain/entity/notification";
import { makeAccount } from "@/test/factories/make-account";
import { makeNotification } from "@/test/factories/make-notification";
import { FakeNotificationRepository } from "@/test/repositories/fake-notification.repository";

import { FetchNotificationsByRecipientIdUseCase } from "./fetch-notifications-by-recipient-id.use-cases";

describe("FetchNotificationsByRecipientId", () => {
  let sut: FetchNotificationsByRecipientIdUseCase;
  let fakeNotificationRepository: FakeNotificationRepository;

  beforeEach(() => {
    fakeNotificationRepository = new FakeNotificationRepository();
    sut = new FetchNotificationsByRecipientIdUseCase(fakeNotificationRepository);
  });

  it("should fetch notifications by recipient id", async () => {
    const NOTIFICATIONS_LENGTH = 21;
    const account = makeAccount();
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
});

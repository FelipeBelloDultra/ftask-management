import { Right } from "@/core/either";
import { Notification } from "@/modules/notification/domain/entity/notification";
import { makeAccount } from "@/test/factories/make-account";
import { makeNotification } from "@/test/factories/make-notification";
import { InMemoryNotificationMetadataRepository } from "@/test/repositories/in-memory-notification-metadata.repository";
import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification.repository";

import { FetchNotificationsByRecipientIdDto } from "../dtos/fetch-notifications-by-recipient-id-dto";

import { FetchNotificationsByRecipientIdUseCase } from "./fetch-notifications-by-recipient-id.use-cases";

describe("FetchNotificationsByRecipientId", () => {
  let sut: FetchNotificationsByRecipientIdUseCase;
  let inMemoryNotificationRepository: InMemoryNotificationRepository;

  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository(new InMemoryNotificationMetadataRepository());
    sut = new FetchNotificationsByRecipientIdUseCase(inMemoryNotificationRepository);
  });

  it("should fetch notifications by recipient id", async () => {
    const NOTIFICATIONS_LENGTH = 21;
    const account = makeAccount();
    const notifications = Array.from({ length: NOTIFICATIONS_LENGTH }, () =>
      makeNotification({
        recipientId: account.id,
      }),
    );

    await Promise.all(notifications.map((n) => inMemoryNotificationRepository.create(n)));

    const result = (await sut.execute(
      FetchNotificationsByRecipientIdDto.create({
        recipientId: account.id.toValue(),
        limit: 10,
        page: 1,
      }),
    )) as Right<never, { notifications: Notification[]; total: number }>;

    expect(result.isRight()).toBeTruthy();
    expect(result.value.notifications.length).toBe(10);
    expect(result.value.total).toBe(NOTIFICATIONS_LENGTH);
  });
});

import { Notification } from "@/modules/notification/domain/entity/notification";
import { makeAccount } from "@/test/factories/make-account";
import { makeNotification } from "@/test/factories/make-notification";
import { InMemoryNotificationMetadataRepository } from "@/test/repositories/in-memory-notification-metadata.repository";
import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification.repository";

import { MarkNotificationAsReadDto } from "../dtos/mark-notification-as-read-dto";

import { DifferentAccountNotificationError } from "./errors/different-account-notification.error";
import { NotificationAlreadyMarkedAsReadError } from "./errors/notification-already-marked-as-read.error";
import { NotificationNotFoundError } from "./errors/notification-not-found.error";
import { MarkNotificationAsReadUseCase } from "./mark-notification-as-read.use-case";

describe("MarkNotificationAsReadUseCase", () => {
  let sut: MarkNotificationAsReadUseCase;
  let inMemoryNotificationRepository: InMemoryNotificationRepository;

  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository(new InMemoryNotificationMetadataRepository());
    sut = new MarkNotificationAsReadUseCase(inMemoryNotificationRepository);
  });

  it("should mark notification as read", async () => {
    const account = makeAccount();
    const notification = makeNotification({ recipientId: account.id });

    await inMemoryNotificationRepository.create(notification);

    const result = await sut.execute(
      MarkNotificationAsReadDto.create({
        recipientId: account.id.toValue(),
        notificationId: notification.id.toValue(),
      }),
    );

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        notification: expect.any(Notification),
      }),
    );
  });

  it("should not be able to mark notification as read if notification does not exists", async () => {
    const account = makeAccount();

    const result = await sut.execute(
      MarkNotificationAsReadDto.create({
        recipientId: account.id.toValue(),
        notificationId: "fake-notification-id",
      }),
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotificationNotFoundError);
  });

  it("should not be able to mark notification as read if this notifications is from a different user", async () => {
    const recipientAccount = makeAccount();
    const notification = makeNotification({ recipientId: recipientAccount.id });

    await inMemoryNotificationRepository.create(notification);

    const result = await sut.execute(
      MarkNotificationAsReadDto.create({
        recipientId: "invalid-recipient-id",
        notificationId: notification.id.toValue(),
      }),
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DifferentAccountNotificationError);
  });

  it("should not be able to mark notification as read if this notification already was marked as read", async () => {
    const account = makeAccount();
    const notification = makeNotification({ recipientId: account.id, wasRead: true });

    await inMemoryNotificationRepository.create(notification);

    const result = await sut.execute(
      MarkNotificationAsReadDto.create({
        recipientId: account.id.toValue(),
        notificationId: notification.id.toValue(),
      }),
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotificationAlreadyMarkedAsReadError);
  });
});

import { makeAccount } from "@/test/factories/make-account";
import { makeNotification } from "@/test/factories/make-notification";
import { InMemoryNotificationMetadataRepository } from "@/test/repositories/in-memory-notification-metadata.repository";
import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification.repository";

import { NotificationMetadata } from "../../domain/entity/notification-metadata";
import { NotificationMetadataList } from "../../domain/entity/notification-metadata-list";
import { ShowNotificationDetailByIdDto } from "../dtos/show-notification-detail-by-id-dto";

import { NotificationNotFoundError } from "./errors/notification-not-found.error";
import { ShowNotificationDetailByIdUseCase } from "./show-notification-detail-by-id.use-case";

describe("ShowNotificationDetailByIdUseCase", () => {
  let inMemoryNotificationMetadataRepository: InMemoryNotificationMetadataRepository;
  let inMemoryNotificationRepository: InMemoryNotificationRepository;
  let sut: ShowNotificationDetailByIdUseCase;

  beforeEach(() => {
    inMemoryNotificationMetadataRepository = new InMemoryNotificationMetadataRepository();
    inMemoryNotificationRepository = new InMemoryNotificationRepository(inMemoryNotificationMetadataRepository);
    sut = new ShowNotificationDetailByIdUseCase(inMemoryNotificationRepository);
  });

  it("should show the notification by id", async () => {
    const account = makeAccount();
    const notification = makeNotification({ recipientId: account.id });

    notification.additionalInfos = new NotificationMetadataList([
      NotificationMetadata.create({
        key: "notification-key",
        value: "notification-value",
        notificationId: notification.id,
      }),
    ]);

    await inMemoryNotificationRepository.create(notification);

    const result = await sut.execute(
      ShowNotificationDetailByIdDto.create({
        recipientId: account.id.toValue(),
        notificationId: notification.id.toValue(),
      }),
    );

    if (result.isLeft()) {
      throw new Error(result.value.name);
    }

    expect(result.isRight()).toBeTruthy();
    expect(result.value.notificationDetail.notificationId.equals(notification.id)).toBeTruthy();
    expect(result.value.notificationDetail.recipientId.equals(account.id)).toBeTruthy();
  });

  it("should cannot show the notification by id if the notification does not exist", async () => {
    const account = makeAccount();

    const result = await sut.execute(
      ShowNotificationDetailByIdDto.create({
        recipientId: account.id.toValue(),
        notificationId: "invalid-notification-id",
      }),
    );

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotificationNotFoundError);
  });

  it("should cannot show the notification by id if the recipient id does not match", async () => {
    const account = makeAccount();
    const notification = makeNotification({ recipientId: account.id });

    await inMemoryNotificationRepository.create(notification);

    const result = await sut.execute(
      ShowNotificationDetailByIdDto.create({
        recipientId: "invalid-recipient-id",
        notificationId: notification.id.toValue(),
      }),
    );

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotificationNotFoundError);
  });
});

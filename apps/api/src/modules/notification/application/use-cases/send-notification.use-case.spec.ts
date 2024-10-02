import { InMemoryNotificationMetadataRepository } from "@/test/repositories/in-memory-notification-metadata.repository";
import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification.repository";

import { SendNotificationDto } from "../dtos/send-notification-dto";

import { SendNotificationUseCase } from "./send-notification.use-case";

describe("SendNotificationUseCase", () => {
  let inMemoryNotificationMetadataRepository: InMemoryNotificationMetadataRepository;
  let inMemoryNotificationRepository: InMemoryNotificationRepository;
  let sut: SendNotificationUseCase;

  beforeEach(() => {
    inMemoryNotificationMetadataRepository = new InMemoryNotificationMetadataRepository();
    inMemoryNotificationRepository = new InMemoryNotificationRepository(inMemoryNotificationMetadataRepository);
    sut = new SendNotificationUseCase(inMemoryNotificationRepository);
  });

  it("should be able to send notifications", async () => {
    const result = await sut.execute(
      SendNotificationDto.create({
        content: "test content",
        recipientId: "test recipient id",
        title: "test title",
      }),
    );

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationRepository.notifications.length).toBe(1);
  });

  it("should be able to send notification with additional infos", async () => {
    const result = await sut.execute(
      SendNotificationDto.create({
        content: "test content",
        recipientId: "test recipient id",
        title: "test title",
        additionalInfos: [
          { key: "test key 1", value: "test value 1" },
          { key: "test key 2", value: "test value 2" },
          { key: "test key 3", value: "test value 3" },
        ],
      }),
    );

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationRepository.notifications.length).toBe(1);
    expect(inMemoryNotificationMetadataRepository.notificationsMetadata.length).toBe(3);
  });

  it("should not be able to create additional info if the array is empty", async () => {
    const result = await sut.execute(
      SendNotificationDto.create({
        content: "test content",
        recipientId: "test recipient id",
        title: "test title",
        additionalInfos: [],
      }),
    );

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationRepository.notifications.length).toBe(1);
    expect(inMemoryNotificationMetadataRepository.notificationsMetadata.length).toBe(0);
  });
});

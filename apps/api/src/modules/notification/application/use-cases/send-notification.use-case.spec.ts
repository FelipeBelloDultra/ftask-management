import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification.repository";

import { SendNotificationUseCase } from "./send-notification.use-case";

describe("SendNotificationUseCase", () => {
  let inMemoryNotificationRepository: InMemoryNotificationRepository;
  let sut: SendNotificationUseCase;

  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationRepository);
  });

  it("should be able to send notifications", async () => {
    const result = await sut.execute({
      content: "test content",
      recipientId: "test recipient id",
      title: "test title",
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationRepository.notifications.length).toBe(1);
  });
});

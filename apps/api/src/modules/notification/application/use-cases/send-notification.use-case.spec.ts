import { FakeNotificationRepository } from "@/test/repositories/fake-notification.repository";

import { SendNotificationUseCase } from "./send-notification.use-case";

describe("SendNotificationUseCase", () => {
  let fakeNotificationRepository: FakeNotificationRepository;
  let sut: SendNotificationUseCase;

  beforeEach(() => {
    fakeNotificationRepository = new FakeNotificationRepository();
    sut = new SendNotificationUseCase(fakeNotificationRepository);
  });

  it("should be able to send notifications", async () => {
    const result = await sut.execute({
      content: "test content",
      recipientId: "test recipient id",
      title: "test title",
    });

    expect(result.isRight()).toBeTruthy();
    expect(fakeNotificationRepository.notifications.length).toBe(1);
  });
});

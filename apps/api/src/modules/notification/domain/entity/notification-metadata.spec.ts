import { makeNotificationMetadata } from "@/test/factories/make-notification-metadata";

import { NotificationMetadata } from "./notification-metadata";

describe("NotificationMetadata", () => {
  it("should create notification metadata instance", () => {
    const sut = makeNotificationMetadata();

    expect(sut).toBeInstanceOf(NotificationMetadata);
    expect(sut.key).toBeDefined();
    expect(sut.value).toBeDefined();
    expect(sut.notificationId).toBeDefined();
  });
});

import { makeNotification } from "@/test/factories/make-notification";

import { NotificationDetail } from "./notification-detail";

describe("NotificationDetail", () => {
  it("should create a notification detail instance", () => {
    const notification = makeNotification();
    const notificationDetail = NotificationDetail.create({
      additionalInfos: [],
      content: notification.content,
      createdAt: new Date(),
      notificationId: notification.id,
      recipientId: notification.recipientId,
      readAt: null,
      title: notification.title,
    });

    expect(notificationDetail.additionalInfos.length).toBe(0);
    expect(notificationDetail.content).toBe(notification.content);
    expect(notificationDetail.createdAt).toBeInstanceOf(Date);
    expect(notificationDetail.notificationId.equals(notification.id)).toBeTruthy();
    expect(notificationDetail.recipientId.equals(notification.recipientId)).toBeTruthy();
    expect(notificationDetail.readAt).toBeNull();
    expect(notificationDetail.title).toBe(notification.title);
  });
});

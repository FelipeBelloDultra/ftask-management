import { Notification } from "@/modules/notification/domain/entity/notification";

export class NotificationPresenter {
  public static toHTTP(notification: Notification) {
    return {
      id: notification.id.toValue(),
      title: notification.title,
      created_at: notification.createdAt,
      read_at: notification.readAt,
      content: notification.content,
      recipient_id: notification.recipientId.toValue(),
    };
  }
}

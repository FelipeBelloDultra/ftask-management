import { Notification } from "@/modules/notification/domain/entity/notification";

export class NotificationPresenter {
  public static toHTTP(notification: Notification) {
    return {
      id: notification.id.toValue(),
      title: notification.values.title,
      created_at: notification.values.createdAt,
      read_at: notification.values.readAt,
      content: notification.values.content,
      recipient_id: notification.values.recipientId.toValue(),
    };
  }
}

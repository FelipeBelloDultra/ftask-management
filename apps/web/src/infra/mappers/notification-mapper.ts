import { Notification } from "@/domain/notification";

export interface PersistenceNotification {
  id: string;
  title: string;
  created_at: Date;
  read_at: Date | null;
  content: string;
  recipient_id: string;
}

export class NotificationMapper {
  public static toDomain(raw: PersistenceNotification): Notification {
    return Notification.create({
      id: raw.id,
      title: raw.title,
      createdAt: raw.created_at,
      readAt: raw.read_at,
      content: raw.content,
      recipientId: raw.recipient_id,
    });
  }

  public static toPersistence(notification: Notification): PersistenceNotification {
    return {
      id: notification.id,
      title: notification.title,
      created_at: notification.createdAt,
      read_at: notification.readAt,
      content: notification.content,
      recipient_id: notification.recipientId,
    };
  }
}

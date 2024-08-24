import { Notification } from "@/domain/notification";

export interface PersistenceNotification {
  id: string;
  title: string;
  created_at: string;
  read_at: string | null;
  content: string;
  recipient_id: string;
}

export class NotificationMapper {
  public static toDomain(raw: PersistenceNotification): Notification {
    return Notification.create({
      id: raw.id,
      title: raw.title,
      createdAt: new Date(raw.created_at),
      readAt: raw.read_at ? new Date(raw.read_at) : null,
      content: raw.content,
      recipientId: raw.recipient_id,
    });
  }

  public static toPersistence(notification: Notification): PersistenceNotification {
    return {
      id: notification.id,
      title: notification.title,
      created_at: notification.createdAt.toISOString(),
      read_at: notification.readAt ? notification.readAt.toISOString() : null,
      content: notification.content,
      recipient_id: notification.recipientId,
    };
  }
}

import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { NotificationRepository } from "@/modules/notification/application/repositories/notification.repository";
import { Notification } from "@/modules/notification/domain/entity/notification";

export class InMemoryNotificationRepository implements NotificationRepository {
  public readonly notifications: Notification[] = [];

  public async create(notification: Notification): Promise<void> {
    this.notifications.push(notification);
  }

  public async save(notification: Notification): Promise<void> {
    const notificationIndex = this.notifications.findIndex((n) => n.id.equals(notification.id));

    if (notificationIndex !== -1) {
      this.notifications[notificationIndex] = notification;
    }
  }

  public async findById(id: UniqueEntityID): Promise<Notification | null> {
    const notification = this.notifications.find((n) => n.id.equals(id));

    if (!notification) {
      return null;
    }

    return notification;
  }

  public async fetchManyByRecipientId(
    recipientId: UniqueEntityID,
    pagination: Pagination,
  ): Promise<{
    notifications: Array<Notification>;
    total: number;
  }> {
    const notifications = this.notifications.filter((n) => n.recipientId.equals(recipientId));

    return {
      notifications: notifications.slice(pagination.skip, pagination.take),
      total: notifications.length,
    };
  }
}
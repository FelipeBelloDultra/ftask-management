import { PaginationRepository } from "@/application/repositories/pagination.repository";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { NotificationRepository } from "@/modules/notification/application/repositories/notification.repository";
import { Notification } from "@/modules/notification/domain/entity/notification";

export class FakeNotificationRepository implements NotificationRepository {
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

  public async findManyByRecipientId(
    recipientId: UniqueEntityID,
    { limit, page }: PaginationRepository,
  ): Promise<{
    notifications: Array<Notification>;
    total: number;
  }> {
    const notifications = this.notifications.filter((n) => n.recipientId.equals(recipientId));

    const SKIP = (page - 1) * limit;
    const TAKE = page * limit;

    return {
      notifications: notifications.slice(SKIP, TAKE),
      total: notifications.length,
    };
  }
}

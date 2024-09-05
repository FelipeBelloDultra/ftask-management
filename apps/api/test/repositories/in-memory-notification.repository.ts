import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import {
  CountByRecipientIdFilters,
  FetchManyByRecipientIdFilters,
  NotificationRepository,
} from "@/modules/notification/application/repositories/notification.repository";
import { Notification } from "@/modules/notification/domain/entity/notification";
import { NotificationDetail } from "@/modules/notification/domain/entity/value-objects/notification-detail";

import { InMemoryNotificationMetadataRepository } from "./in-memory-notification-metadata.repository";

export class InMemoryNotificationRepository implements NotificationRepository {
  public readonly notifications: Notification[] = [];

  public constructor(private readonly notificationMetadataRepository: InMemoryNotificationMetadataRepository) {}

  public async create(notification: Notification): Promise<void> {
    this.notifications.push(notification);

    this.notificationMetadataRepository.createMany(notification.additionalInfos.getItems());
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

  public async findDetailById(id: UniqueEntityID): Promise<NotificationDetail | null> {
    const notification = this.notifications.find((n) => n.id.equals(id));

    if (!notification) {
      return null;
    }

    const notificationMetadata = this.notificationMetadataRepository.notificationsMetadata.filter((n) =>
      n.notificationId.equals(notification.id),
    );

    return NotificationDetail.create({
      notificationId: notification.id,
      recipientId: notification.recipientId,
      additionalInfos: notificationMetadata,
      content: notification.content,
      createdAt: notification.createdAt,
      title: notification.title,
      readAt: notification.readAt,
    });
  }

  public async fetchManyByRecipientId(
    recipientId: UniqueEntityID,
    pagination: Pagination,
    filter: FetchManyByRecipientIdFilters,
  ): Promise<{
    notifications: Array<Notification>;
    total: number;
  }> {
    const notifications = this.notifications.filter((n) => n.recipientId.equals(recipientId));
    let notificationsWithFilter = notifications;

    if (filter.read !== undefined && typeof filter.read === "boolean") {
      notificationsWithFilter = notificationsWithFilter.filter((n) => Boolean(n.readAt) === filter.read);
    }

    return {
      notifications: notificationsWithFilter.slice(pagination.skip, pagination.take),
      total: notifications.length,
    };
  }

  public async countByRecipientId(
    recipientId: UniqueEntityID,
    filters: CountByRecipientIdFilters,
  ): Promise<{ total: number }> {
    const notificationCount = this.notifications.filter((notification) => {
      return (
        notification.recipientId.equals(recipientId) && (filters.read ? !!notification.readAt : !notification.readAt)
      );
    }).length;

    return {
      total: notificationCount,
    };
  }
}

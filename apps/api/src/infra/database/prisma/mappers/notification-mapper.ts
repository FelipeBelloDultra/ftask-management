import { Notifications as PrismaNotification } from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Notification } from "@/modules/notification/domain/entity/notification";

export class NotificationMapper {
  public static toDomain(prismaNotification: PrismaNotification): Notification {
    return Notification.create(
      {
        recipientId: UniqueEntityID.create(prismaNotification.recipientId),
        content: prismaNotification.content,
        createdAt: prismaNotification.createdAt,
        wasRead: !!prismaNotification.readAt,
        title: prismaNotification.title,
        readAt: prismaNotification.readAt,
      },
      UniqueEntityID.create(prismaNotification.id),
    );
  }

  public static toPersistence(notification: Notification): PrismaNotification {
    return {
      id: notification.id.toValue(),
      recipientId: notification.values.recipientId.toValue(),
      content: notification.values.content,
      title: notification.values.title,
      readAt: notification.values.readAt,
      createdAt: notification.values.createdAt,
    };
  }
}

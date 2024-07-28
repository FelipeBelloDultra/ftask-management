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
      recipientId: notification.recipientId.toValue(),
      content: notification.content,
      title: notification.title,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    };
  }
}

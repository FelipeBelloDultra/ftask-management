import { NotificationsMetadata as PrismaNotificationMetadata } from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { NotificationMetadata } from "@/modules/notification/domain/entity/notification-metadata";

export class NotificationMetadataMapper {
  public static toDomain(prismaNotificationMetadata: PrismaNotificationMetadata): NotificationMetadata {
    return NotificationMetadata.create(
      {
        notificationId: UniqueEntityID.create(prismaNotificationMetadata.notificationId),
        key: prismaNotificationMetadata.key,
        value: prismaNotificationMetadata.value,
      },
      UniqueEntityID.create(prismaNotificationMetadata.id),
    );
  }

  public static toPersistence(notificationMetadata: NotificationMetadata): PrismaNotificationMetadata {
    return {
      id: notificationMetadata.id.toValue(),
      notificationId: notificationMetadata.notificationId.toValue(),
      key: notificationMetadata.key,
      value: notificationMetadata.value,
    };
  }
}

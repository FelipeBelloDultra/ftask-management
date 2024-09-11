import {
  Notification as PrismaNotification,
  NotificationsMetadata as PrismaNotificationsMetadata,
} from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { NotificationDetail } from "@/modules/notification/domain/entity/value-objects/notification-detail";

import { NotificationMetadataMapper } from "./notification-metadata-mapper";

export type PrismaNotificationDetail = PrismaNotification & {
  notificationsMetadata: Array<PrismaNotificationsMetadata>;
};

export class NotificationDetailMapper {
  public static toDomain(raw: PrismaNotificationDetail): NotificationDetail {
    return NotificationDetail.create({
      recipientId: UniqueEntityID.create(raw.recipientId),
      notificationId: UniqueEntityID.create(raw.id),
      additionalInfos: raw.notificationsMetadata.map(NotificationMetadataMapper.toDomain),
      content: raw.content,
      createdAt: raw.createdAt,
      title: raw.title,
      readAt: raw.readAt,
    });
  }
}

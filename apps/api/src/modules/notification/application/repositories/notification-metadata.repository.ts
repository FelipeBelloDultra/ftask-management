import { NotificationMetadata } from "@/modules/notification/domain/entity/notification-metadata";

export interface NotificationMetadataRepository {
  createMany(notificationsMetadata: Array<NotificationMetadata>): Promise<void>;
}

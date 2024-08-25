import { NotificationMetadata } from "../../domain/entity/notification-metadata";

export interface NotificationMetadataRepository {
  createMany(notificationsMetadata: Array<NotificationMetadata>): Promise<void>;
}

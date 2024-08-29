import { NotificationMetadataRepository } from "@/modules/notification/application/repositories/notification-metadata.repository";
import { NotificationMetadata } from "@/modules/notification/domain/entity/notification-metadata";

export class InMemoryNotificationMetadataRepository implements NotificationMetadataRepository {
  public readonly notificationsMetadata: Array<NotificationMetadata> = [];

  public async createMany(notificationsMetadata: Array<NotificationMetadata>): Promise<void> {
    this.notificationsMetadata.push(...notificationsMetadata);
  }
}

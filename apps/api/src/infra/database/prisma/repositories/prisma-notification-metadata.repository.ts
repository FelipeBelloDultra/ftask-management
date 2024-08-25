import { inject, injectable } from "tsyringe";

import { NotificationMetadataRepository } from "@/modules/notification/application/repositories/notification-metadata.repository";
import { NotificationMetadata } from "@/modules/notification/domain/entity/notification-metadata";

import { NotificationMetadataMapper } from "../mappers/notification-metadata-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaNotificationMetadataRepository implements NotificationMetadataRepository {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async createMany(notificationsMetadata: Array<NotificationMetadata>): Promise<void> {
    if (notificationsMetadata.length === 0) {
      return;
    }

    await this.prismaConnection.notificationsMetadata.createMany({
      data: notificationsMetadata.map((notificationMetadata) =>
        NotificationMetadataMapper.toPersistence(notificationMetadata),
      ),
    });
  }
}

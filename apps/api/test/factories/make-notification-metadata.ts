import { faker } from "@faker-js/faker";
import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { NotificationMetadataMapper } from "@/infra/database/prisma/mappers/notification-metadata-mapper";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import {
  NotificationMetadata,
  NotificationMetadataProps,
} from "@/modules/notification/domain/entity/notification-metadata";

export function makeNotificationMetadata(
  override: Partial<NotificationMetadataProps> = {},
  id?: UniqueEntityID,
): NotificationMetadata {
  const notificationMetadata = NotificationMetadata.create(
    {
      key: faker.lorem.word(),
      value: faker.lorem.words(4),
      notificationId: UniqueEntityID.create(),
      ...override,
    },
    id,
  );

  return notificationMetadata;
}

@injectable()
export class NotificationMetadataFactory {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async makePrismaNotificationMetadata(override: Partial<NotificationMetadataProps> = {}, id?: UniqueEntityID) {
    const notificationMetadata = makeNotificationMetadata(override, id);

    await this.prismaConnection.notificationsMetadata.create({
      data: NotificationMetadataMapper.toPersistence(notificationMetadata),
    });

    return notificationMetadata;
  }
}

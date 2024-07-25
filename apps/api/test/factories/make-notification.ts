import { faker } from "@faker-js/faker";
import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { NotificationMapper } from "~/infra/database/prisma/mappers/notification-mapper";
import { PrismaConnection } from "~/infra/database/prisma/prisma-connection";
import { Notification, NotificationProps } from "~/modules/notification/domain/entity/notification";

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityID): Notification {
  const notification = Notification.create(
    {
      content: faker.lorem.words(6),
      recipientId: UniqueEntityID.create(),
      title: faker.lorem.words(2),
      ...override,
    },
    id,
  );

  return notification;
}

@injectable()
export class NotificationFactory {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async makePrismaNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityID) {
    const notification = makeNotification(override, id);

    await this.prismaConnection.notifications.create({
      data: NotificationMapper.toPersistence(notification),
    });

    return notification;
  }
}

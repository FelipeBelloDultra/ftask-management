import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { NotificationRepository } from "~/modules/notification/application/repositories/notification.repository";
import { Notification } from "~/modules/notification/domain/entity/notification";

import { NotificationMapper } from "../mappers/notification-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async create(notification: Notification): Promise<void> {
    await this.prismaConnection.notifications.create({
      data: NotificationMapper.toPersistence(notification),
    });
  }

  public async save(notification: Notification): Promise<void> {
    await this.prismaConnection.notifications.update({
      where: {
        id: notification.id.toValue(),
      },
      data: NotificationMapper.toPersistence(notification),
    });
  }

  public async findById(id: UniqueEntityID): Promise<Notification | null> {
    const notification = await this.prismaConnection.notifications.findUnique({
      where: {
        id: id.toValue(),
      },
    });

    if (!notification) return null;

    return NotificationMapper.toDomain(notification);
  }

  public async findManyByRecipientId(recipientId: UniqueEntityID): Promise<Array<Notification>> {
    const notifications = await this.prismaConnection.notifications.findMany({
      where: {
        recipientId: recipientId.toValue(),
      },
    });

    return notifications.map(NotificationMapper.toDomain);
  }
}

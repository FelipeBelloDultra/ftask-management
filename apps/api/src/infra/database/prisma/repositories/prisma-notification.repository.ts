import { Notifications as PrismaNotification } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { CacheRepository } from "@/infra/cache/cache.repository";
import { NotificationRepository } from "@/modules/notification/application/repositories/notification.repository";
import { Notification } from "@/modules/notification/domain/entity/notification";

import { NotificationMapper } from "../mappers/notification-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
    @inject("CacheRepository")
    private readonly cache: CacheRepository,
  ) {}

  public async create(notification: Notification): Promise<void> {
    await Promise.all([
      this.prismaConnection.notifications.create({
        data: NotificationMapper.toPersistence(notification),
      }),
      this.cache.delete(`account:${notification.recipientId.toValue()}:notifications`),
    ]);
  }

  public async save(notification: Notification): Promise<void> {
    await Promise.all([
      this.prismaConnection.notifications.update({
        where: {
          id: notification.id.toValue(),
        },
        data: NotificationMapper.toPersistence(notification),
      }),
      this.cache.delete(`account:${notification.recipientId.toValue()}:notifications`),
    ]);
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
    const CACHE_KEY = `account:${recipientId.toValue()}:notifications`;
    const cacheHit = await this.cache.get(CACHE_KEY);

    if (cacheHit) {
      const notifications = JSON.parse(cacheHit) as Array<PrismaNotification>;

      return notifications.map(NotificationMapper.toDomain);
    }

    const notifications = await this.prismaConnection.notifications.findMany({
      where: {
        recipientId: recipientId.toValue(),
      },
    });

    await this.cache.set(CACHE_KEY, JSON.stringify(notifications));

    return notifications.map(NotificationMapper.toDomain);
  }
}

import { Notifications as PrismaNotification } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { PaginationRepository } from "@/application/repositories/pagination.repository";
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
      this.cache.delete(`account:${notification.recipientId.toValue()}:notifications:*`),
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
      this.cache.delete(`account:${notification.recipientId.toValue()}:notifications:*`),
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

  public async findManyByRecipientId(
    recipientId: UniqueEntityID,
    pagination: PaginationRepository,
  ): Promise<{
    notifications: Array<Notification>;
    total: number;
  }> {
    const CACHE_KEY = `account:${recipientId.toValue()}:notifications:limit-${pagination.limit}:page-${pagination.page}`;
    const cacheHit = await this.cache.get(CACHE_KEY);

    if (cacheHit) {
      const notifications = JSON.parse(cacheHit) as Array<PrismaNotification>;

      return {
        notifications: notifications.map(NotificationMapper.toDomain),
        total: notifications.length,
      };
    }

    const SKIP = (pagination.page - 1) * pagination.limit;
    const TAKE = pagination.page * pagination.limit;
    const [notifications, notificationsCount] = await Promise.all([
      this.prismaConnection.notifications.findMany({
        take: TAKE,
        skip: SKIP,
        where: {
          recipientId: recipientId.toValue(),
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      }),
      this.prismaConnection.notifications.count(),
    ]);

    await this.cache.set(CACHE_KEY, JSON.stringify(notifications));

    return {
      notifications: notifications.map(NotificationMapper.toDomain),
      total: notificationsCount,
    };
  }
}

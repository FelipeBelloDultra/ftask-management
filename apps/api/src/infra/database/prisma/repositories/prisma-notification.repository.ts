import { Notification as PrismaNotification } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { CacheRepository } from "@/infra/cache/cache.repository";
import {
  CountByRecipientIdFilters,
  NotificationRepository,
} from "@/modules/notification/application/repositories/notification.repository";
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
      this.prismaConnection.notification.create({
        data: NotificationMapper.toPersistence(notification),
      }),
      this.cache.delete(`account-${notification.recipientId.toValue()}:notifications:*`),
    ]);
  }

  public async save(notification: Notification): Promise<void> {
    await Promise.all([
      this.prismaConnection.notification.update({
        where: {
          id: notification.id.toValue(),
        },
        data: NotificationMapper.toPersistence(notification),
      }),
      this.cache.delete(`account-${notification.recipientId.toValue()}:notifications:*`),
    ]);
  }

  public async findById(id: UniqueEntityID): Promise<Notification | null> {
    const notification = await this.prismaConnection.notification.findUnique({
      where: {
        id: id.toValue(),
      },
    });

    if (!notification) return null;

    return NotificationMapper.toDomain(notification);
  }

  public async fetchManyByRecipientId(
    recipientId: UniqueEntityID,
    pagination: Pagination,
  ): Promise<{
    notifications: Array<Notification>;
    total: number;
  }> {
    const CACHE_KEY = `account-${recipientId.toValue()}:notifications:limit-${pagination.limit}:page-${pagination.page}`;
    const cacheHit = await this.cache.get(CACHE_KEY);

    if (cacheHit) {
      const { notifications, total } = JSON.parse(cacheHit) as {
        notifications: Array<PrismaNotification>;
        total: number;
      };

      return {
        notifications: notifications.map(NotificationMapper.toDomain),
        total,
      };
    }

    const [notifications, notificationsCount] = await Promise.all([
      this.prismaConnection.notification.findMany({
        take: pagination.take,
        skip: pagination.skip,
        where: {
          recipientId: recipientId.toValue(),
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      }),
      this.prismaConnection.notification.count({
        where: {
          recipientId: recipientId.toValue(),
        },
      }),
    ]);

    await this.cache.set(CACHE_KEY, JSON.stringify({ notifications, total: notificationsCount }));

    return {
      notifications: notifications.map(NotificationMapper.toDomain),
      total: notificationsCount,
    };
  }
  public async countByRecipientId(
    recipientId: UniqueEntityID,
    filters: CountByRecipientIdFilters,
  ): Promise<{
    total: number;
  }> {
    const CACHE_KEY = `account-${recipientId.toValue()}:notifications:count:read-${filters.read}`;
    const cacheHit = await this.cache.get(CACHE_KEY);

    if (cacheHit) {
      const notificationsCount = Number(cacheHit);

      return {
        total: notificationsCount,
      };
    }

    const notificationsCount = await this.prismaConnection.notification.count({
      where: {
        recipientId: recipientId.toValue(),
        readAt: filters.read ? { not: null } : null,
      },
    });

    await this.cache.set(CACHE_KEY, JSON.stringify(notificationsCount));

    return {
      total: notificationsCount,
    };
  }
}

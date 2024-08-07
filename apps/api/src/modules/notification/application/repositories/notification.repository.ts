import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Notification } from "@/modules/notification/domain/entity/notification";

export interface CountByRecipientIdFilters {
  read: boolean;
}

export interface NotificationRepository {
  create(notification: Notification): Promise<void>;
  save(notification: Notification): Promise<void>;
  findById(id: UniqueEntityID): Promise<Notification | null>;
  fetchManyByRecipientId(
    recipientId: UniqueEntityID,
    pagination: Pagination,
  ): Promise<{
    notifications: Array<Notification>;
    total: number;
  }>;
  countByRecipientId(
    recipientId: UniqueEntityID,
    filters: CountByRecipientIdFilters,
  ): Promise<{
    total: number;
  }>;
}

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Notification } from "@/modules/notification/domain/entity/notification";

export interface NotificationRepository {
  create(notification: Notification): Promise<void>;
  save(notification: Notification): Promise<void>;
  findById(id: UniqueEntityID): Promise<Notification | null>;
  findManyByRecipientId(recipientId: UniqueEntityID): Promise<Array<Notification>>;
}
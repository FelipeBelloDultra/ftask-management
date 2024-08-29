import { inject, injectable } from "tsyringe";

import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { NotificationRepository } from "@/modules/notification/application/repositories/notification.repository";
import { Notification } from "@/modules/notification/domain/entity/notification";
import { NotificationMetadata } from "@/modules/notification/domain/entity/notification-metadata";
import { NotificationMetadataList } from "@/modules/notification/domain/entity/notification-metadata-list";

type Input = {
  title: string;
  content: string;
  recipientId: string;
  additionalInfos?: Array<{ key: string; value: string }>;
};
type OnError = never;
type OnSuccess = { notification: Notification };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class SendNotificationUseCase {
  public constructor(
    @inject("NotificationRepository")
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const recipientId = UniqueEntityID.create(input.recipientId);

    const notification = Notification.create({
      title: input.title,
      content: input.content,
      recipientId,
    });

    if (input.additionalInfos && input.additionalInfos.length > 0) {
      const notificationMetadata = input.additionalInfos.map((info) => {
        return NotificationMetadata.create({
          key: info.key,
          value: info.value,
          notificationId: notification.id,
        });
      });

      notification.additionalInfos = new NotificationMetadataList(notificationMetadata);
    }

    await this.notificationRepository.create(notification);

    return right({
      notification,
    });
  }
}

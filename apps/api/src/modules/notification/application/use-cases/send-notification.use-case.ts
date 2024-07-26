import { inject, injectable } from "tsyringe";

import { Either, right } from "~/core/either";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Notification } from "~/modules/notification/domain/entity/notification";

import { NotificationRepository } from "../repositories/notification.repository";

type Input = {
  title: string;
  content: string;
  recipientId: string;
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

    await this.notificationRepository.create(notification);

    return right({
      notification,
    });
  }
}

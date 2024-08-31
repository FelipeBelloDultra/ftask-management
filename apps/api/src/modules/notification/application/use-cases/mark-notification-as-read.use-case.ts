import { inject, injectable } from "tsyringe";

import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Notification } from "@/modules/notification/domain/entity/notification";

import { NotificationRepository } from "../repositories/notification.repository";

import { DifferentAccountNotificationError } from "./errors/different-account-notification.error";
import { NotificationAlreadyMarkedAsReadError } from "./errors/notification-already-marked-as-read.error";
import { NotificationNotFoundError } from "./errors/notification-not-found.error";

type Input = {
  notificationId: string;
  recipientId: string;
};
type OnError = NotificationNotFoundError | DifferentAccountNotificationError | NotificationAlreadyMarkedAsReadError;
type OnSuccess = { notification: Notification };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class MarkNotificationAsReadUseCase {
  public constructor(
    @inject("NotificationRepository")
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const notificationId = UniqueEntityID.create(input.notificationId);
    const notification = await this.notificationRepository.findById(notificationId);

    if (!notification) {
      return left(new NotificationNotFoundError());
    }

    const recipientId = UniqueEntityID.create(input.recipientId);
    if (!notification.recipientId.equals(recipientId)) {
      return left(new DifferentAccountNotificationError());
    }

    if (notification.wasRead) {
      return left(new NotificationAlreadyMarkedAsReadError());
    }

    notification.read();
    await this.notificationRepository.save(notification);

    return right({ notification });
  }
}

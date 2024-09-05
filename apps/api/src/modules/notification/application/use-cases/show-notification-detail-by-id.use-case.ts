import { inject, injectable } from "tsyringe";

import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

import { NotificationDetail } from "../../domain/entity/value-objects/notification-detail";
import { NotificationRepository } from "../repositories/notification.repository";

import { NotificationNotFoundError } from "./errors/notification-not-found.error";

type Input = {
  recipientId: string;
  notificationId: string;
};
type OnError = NotificationNotFoundError;
type OnSuccess = { notificationDetail: NotificationDetail };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class ShowNotificationDetailByIdUseCase {
  public constructor(
    @inject("NotificationRepository")
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const recipientId = UniqueEntityID.create(input.recipientId);
    const notificationId = UniqueEntityID.create(input.notificationId);
    const notificationDetail = await this.notificationRepository.findDetailById(notificationId);

    if (!notificationDetail || !notificationDetail.recipientId.equals(recipientId)) {
      return left(new NotificationNotFoundError());
    }

    return right({
      notificationDetail,
    });
  }
}

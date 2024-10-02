import { inject, injectable } from "tsyringe";

import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

import { CountNotificationsByRecipientIdDto } from "../dtos/count-notifications-by-recipient-id-dto";
import { NotificationRepository } from "../repositories/notification.repository";

type Output = Either<OnError, OnSuccess>;
type OnError = never;
type OnSuccess = {
  total: number;
};

@injectable()
export class CountNotificationsByRecipientIdUseCase {
  public constructor(
    @inject("NotificationRepository")
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(input: CountNotificationsByRecipientIdDto): Promise<Output> {
    const recipientId = UniqueEntityID.create(input.recipientId);

    const { total } = await this.notificationRepository.countByRecipientId(recipientId, {
      read: input.read,
    });

    return right({
      total,
    });
  }
}

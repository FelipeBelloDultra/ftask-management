import { inject, injectable } from "tsyringe";

import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

import { NotificationRepository } from "../repositories/notification.repository";

type Input = {
  recipientId: string;
  read: boolean;
};
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

  public async execute(input: Input): Promise<Output> {
    const recipientId = UniqueEntityID.create(input.recipientId);

    const { total } = await this.notificationRepository.countByRecipientId(recipientId, {
      read: input.read,
    });

    return right({
      total,
    });
  }
}

import { inject, injectable } from "tsyringe";

import { Either, right } from "@/core/either";
import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Notification } from "@/modules/notification/domain/entity/notification";

import { NotificationRepository } from "../repositories/notification.repository";

type Input = {
  recipientId: string;
  limit: number;
  page: number;
};
type OnError = never;
type OnSuccess = { notifications: Notification[]; pagination: Pagination; total: number };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class FetchNotificationsByRecipientIdUseCase {
  public constructor(
    @inject("NotificationRepository")
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const accountId = UniqueEntityID.create(input.recipientId);

    const pagination = Pagination.create({
      limit: input.limit,
      page: input.page,
    });
    const { notifications, total } = await this.notificationRepository.fetchManyByRecipientId(accountId, pagination);

    return right({
      notifications,
      total,
      pagination,
    });
  }
}

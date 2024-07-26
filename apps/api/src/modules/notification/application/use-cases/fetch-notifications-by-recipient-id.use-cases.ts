import { inject, injectable } from "tsyringe";

import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { AccountRepository } from "@/modules/account/application/repositories/account.repository";
import { Notification } from "@/modules/notification/domain/entity/notification";
import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";

import { NotificationRepository } from "../repositories/notification.repository";

type Input = {
  recipientId: string;
};
type OnError = AccountNotFoundError;
type OnSuccess = { notifications: Notification[] };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class FetchNotificationsByRecipientIdUseCase {
  public constructor(
    @inject("NotificationRepository")
    private readonly notificationRepository: NotificationRepository,
    @inject("AccountRepository")
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const accountId = UniqueEntityID.create(input.recipientId);
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return left(new AccountNotFoundError());
    }

    const notifications = await this.notificationRepository.findManyByRecipientId(accountId);

    return right({
      notifications,
    });
  }
}

import { inject, injectable } from "tsyringe";

import { Either, left, right } from "~/core/either";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { AccountRepository } from "~/modules/account/application/repositories/account.repository";
import { Notification } from "~/modules/notification/domain/entity/notification";
import { AccountNotFoundError } from "~/modules/project/application/use-cases/errors/account-not-found.error";

import { NotificationRepository } from "../repositories/notification.repository";

type Input = {
  title: string;
  content: string;
  recipientId: string;
};
type OnError = AccountNotFoundError;
type OnSuccess = { notification: Notification };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class CreateNotificationUseCase {
  public constructor(
    @inject("NotificationRepository")
    private readonly notificationRepository: NotificationRepository,
    @inject("AccountRepository")
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const recipientId = UniqueEntityID.create(input.recipientId);
    const account = await this.accountRepository.findById(recipientId);
    if (!account) {
      return left(new AccountNotFoundError());
    }

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

import { inject, injectable } from "tsyringe";

import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { CompleteAccountProfileEvent } from "@/modules/account/domain/events/complete-account-profile-event";

import { SendNotificationDto } from "../application/dtos/send-notification-dto";
import { SendNotificationUseCase } from "../application/use-cases/send-notification.use-case";

@injectable()
export class OnNewAccountIsCreated implements EventHandler {
  public constructor(
    @inject("SendNotificationUseCase")
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.register(this.sendWelcomeEmail.bind(this), CompleteAccountProfileEvent.name);
  }

  private async sendWelcomeEmail({ account }: CompleteAccountProfileEvent) {
    await this.sendNotificationUseCase.execute(
      SendNotificationDto.create({
        title: "Welcome to our platform",
        content: `Hello ${account.name}! Thank you for joining our community. To complete your profile, please go to Profile menu and add your profile picture`,
        recipientId: account.id.toValue(),
        additionalInfos: [
          {
            key: "setup_profile_picture_url",
            value: "/settings/profile",
          },
        ],
      }),
    );
  }
}

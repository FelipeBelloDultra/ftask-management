import { inject, injectable } from "tsyringe";

import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { MemberIsAddedToProjectEvent } from "@/modules/project/domain/events/member-is-added-to-project-event";

import { SendNotificationUseCase } from "../application/use-cases/send-notification.use-case";

@injectable()
export class OnMemberIsAddedToProject implements EventHandler {
  public constructor(
    @inject("SendNotificationUseCase")
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.register(this.sendNotificationToAccount.bind(this), MemberIsAddedToProjectEvent.name);
  }

  private async sendNotificationToAccount({ projectMemberDetails }: MemberIsAddedToProjectEvent) {
    await this.sendNotificationUseCase.execute({
      title: "New Project Member",
      content: `Hello! You was added to the project ${projectMemberDetails.project.name} as member`,
      recipientId: projectMemberDetails.member.accountId.toValue(),
    });
  }
}

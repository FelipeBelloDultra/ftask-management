import { inject, injectable } from "tsyringe";

import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { MemberIsAddedToProjectEvent } from "@/modules/project/domain/events/member-is-added-to-project-event";

import { SendNotificationDto } from "../application/dtos/send-notification-dto";
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
    DomainEvents.register(this.sendNewProjectMemberNotification.bind(this), MemberIsAddedToProjectEvent.name);
  }

  private async sendNewProjectMemberNotification({ memberWithProject }: MemberIsAddedToProjectEvent) {
    await this.sendNotificationUseCase.execute(
      SendNotificationDto.create({
        title: "New Project Member",
        content: `Hello! You was added to the project ${memberWithProject.project.name} as member`,
        recipientId: memberWithProject.member.accountId.toValue(),
        additionalInfos: [
          {
            key: "project_id",
            value: memberWithProject.project.id.toValue(),
          },
        ],
      }),
    );
  }
}

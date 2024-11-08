import { inject, injectable } from "tsyringe";

import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { ProjectInviteWasCreatedEvent } from "@/modules/project/domain/events/project-invite-was-created-event";

import { SendNotificationDto } from "../application/dtos/send-notification-dto";
import { SendNotificationUseCase } from "../application/use-cases/send-notification.use-case";

@injectable()
export class OnProjectInviteWasCreated implements EventHandler {
  public constructor(
    @inject("SendNotificationUseCase")
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.register(this.sendNewProjectMemberNotification.bind(this), ProjectInviteWasCreatedEvent.name);
  }

  private async sendNewProjectMemberNotification({ inviteDetail }: ProjectInviteWasCreatedEvent) {
    await this.sendNotificationUseCase.execute(
      SendNotificationDto.create({
        title: "New Project Member",
        content: `You have received an invitation to join the project ${inviteDetail.project.name} as a member. Use the links below to accept or decline the invitation.`,
        recipientId: inviteDetail.member.id.toValue(),
        additionalInfos: [
          {
            key: "accept_invite_link",
            value: `invites/${inviteDetail.id.toValue()}/accept`,
          },
          {
            key: "refuse_invite_link",
            value: `invites/${inviteDetail.id.toValue()}/refuse`,
          },
        ],
      }),
    );
  }
}

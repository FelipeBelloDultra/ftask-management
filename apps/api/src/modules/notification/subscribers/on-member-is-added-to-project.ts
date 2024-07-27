import { inject, injectable } from "tsyringe";

import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { MemberRepository } from "@/modules/account/application/repositories/member.repository";
import { ProjectRepository } from "@/modules/project/application/repositories/project.repository";
import { MemberIsAddedToProjectEvent } from "@/modules/project/domain/events/member-is-added-to-project-event";

import { SendNotificationUseCase } from "../application/use-cases/send-notification.use-case";

@injectable()
export class OnMemberIsAddedToProject implements EventHandler {
  public constructor(
    @inject("SendNotificationUseCase")
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    @inject("ProjectRepository")
    private readonly projectRepository: ProjectRepository,
    @inject("MemberRepository")
    private readonly memberRepository: MemberRepository,
  ) {}

  public startSubscriber() {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.register(this.sendNotificationToAccount.bind(this), MemberIsAddedToProjectEvent.name);
  }

  private async sendNotificationToAccount({ projectMember }: MemberIsAddedToProjectEvent) {
    const [project, member] = await Promise.all([
      this.projectRepository.findById(projectMember.projectId),
      this.memberRepository.findById(projectMember.memberId),
    ]);

    if (member && project) {
      await this.sendNotificationUseCase.execute({
        title: "New Project Member",
        content: `Hello! You was added to the project ${project.values.name} as member`,
        recipientId: member.values.accountId.toValue(),
      });
    }
  }
}

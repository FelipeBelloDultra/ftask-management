import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { DomainEvents } from "@/core/events/domain-events";
import { InviteRepository } from "@/modules/project/application/repositories/invite.repository";
import { Invite } from "@/modules/project/domain/entity/invite";

export class InMemoryInviteRepository implements InviteRepository {
  public readonly invites: Invite[] = [];

  public async findById(inviteId: UniqueEntityID): Promise<Invite | null> {
    const invite = this.invites.find((invite) => invite.id.equals(inviteId));

    return invite || null;
  }

  public async create(invite: Invite): Promise<void> {
    this.invites.push(invite);

    DomainEvents.dispatchEventsForAggregate(invite.id);
  }

  public async save(invite: Invite): Promise<void> {
    const invitesIndex = this.invites.findIndex((n) => n.id.equals(invite.id));

    if (invitesIndex !== -1) {
      this.invites[invitesIndex] = invite;
    }
  }

  public async findLastByMemberId(memberId: UniqueEntityID): Promise<Invite | null> {
    const lastInvite = this.invites
      .filter((invite) => invite.memberId.equals(memberId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    return lastInvite || null;
  }
}

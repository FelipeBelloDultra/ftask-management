import { UniqueEntityID } from "@/core/entity/unique-entity-id";
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
  }

  public async save(invite: Invite): Promise<void> {
    const invitesIndex = this.invites.findIndex((n) => n.id.equals(invite.id));

    if (invitesIndex !== -1) {
      this.invites[invitesIndex] = invite;
    }
  }
}

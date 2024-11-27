import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { DomainEvents } from "@/core/events/domain-events";
import {
  FetchManyByMemberIdFilters,
  InviteRepository,
} from "@/modules/project/application/repositories/invite.repository";
import { Invite } from "@/modules/project/domain/entity/invite";
import { InviteWithProject } from "@/modules/project/domain/entity/value-objects/invite-with-project";

import { InMemoryProjectRepository } from "./in-memory-project.repository";

export class InMemoryInviteRepository implements InviteRepository {
  public readonly invites: Invite[] = [];

  public constructor(private readonly projectRepository: InMemoryProjectRepository) {}

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

  public async fetchManyByMemberId(
    memberId: UniqueEntityID,
    pagination: Pagination,
    filters: FetchManyByMemberIdFilters,
  ): Promise<{ invites: InviteWithProject[]; total: number }> {
    const { status } = filters;

    const invites = this.invites.filter((invite) => {
      const isQueryMatched = invite.memberId.equals(memberId) && (!status || invite.status.value === status);

      return isQueryMatched;
    });

    const invitesWithProject = invites.map((invite) => {
      const project = this.projectRepository.projects.find((p) => {
        return p.id.equals(invite.projectId);
      });

      if (!project) {
        throw new Error("there is no project associated with this invite");
      }

      return InviteWithProject.create({
        invite,
        project: {
          description: project.description,
          name: project.name,
          slug: project.slug,
          createdAt: project.createdAt,
          iconUrl: project.iconUrl,
        },
      });
    });

    return {
      invites: invitesWithProject.slice(pagination.skip, pagination.take),
      total: invites.length,
    };
  }
}

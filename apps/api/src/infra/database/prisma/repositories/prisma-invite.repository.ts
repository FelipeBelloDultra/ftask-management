import { inject, injectable } from "tsyringe";

import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { DomainEvents } from "@/core/events/domain-events";
import { CacheRepository } from "@/infra/cache/cache.repository";
import {
  FetchManyByMemberIdFilters,
  InviteRepository,
} from "@/modules/project/application/repositories/invite.repository";
import { Invite } from "@/modules/project/domain/entity/invite";
import { InvitationStatusValues } from "@/modules/project/domain/entity/value-objects/invitation-status";
import { InviteWithProject } from "@/modules/project/domain/entity/value-objects/invite-with-project";

import { InviteMapper } from "../mappers/invite-mapper";
import { InviteWithProjectMapper, PrismaInvitesWithProject } from "../mappers/invite-with-project-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaInviteRepository implements InviteRepository {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
    @inject("CacheRepository")
    private readonly cache: CacheRepository,
  ) {}

  public async findById(inviteId: UniqueEntityID): Promise<Invite | null> {
    const invite = await this.prismaConnection.projectInvites.findUnique({
      where: {
        id: inviteId.toValue(),
      },
    });

    if (!invite) return null;

    return InviteMapper.toDomain(invite);
  }

  public async save(invite: Invite): Promise<void> {
    await Promise.all([
      this.prismaConnection.projectInvites.update({
        where: {
          id: invite.id.toValue(),
        },
        data: InviteMapper.toPersistence(invite),
      }),
      this.cache.deleteByPrefix(this.cache.createKey([`account-${invite.memberId.toValue()}`, "invites"])),
    ]);
  }

  public async create(invite: Invite): Promise<void> {
    await Promise.all([
      this.prismaConnection.projectInvites.create({
        data: InviteMapper.toPersistence(invite),
      }),
      this.cache.deleteByPrefix(this.cache.createKey([`account-${invite.memberId.toValue()}`, "invites"])),
    ]);

    DomainEvents.dispatchEventsForAggregate(invite.id);
  }

  public async findLastByMemberId(inviteId: UniqueEntityID): Promise<Invite | null> {
    const invite = await this.prismaConnection.projectInvites.findFirst({
      where: {
        memberId: inviteId.toValue(),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!invite) return null;

    return InviteMapper.toDomain(invite);
  }

  public async fetchManyByMemberId(
    memberId: UniqueEntityID,
    pagination: Pagination,
    filters: FetchManyByMemberIdFilters,
  ): Promise<{ invites: InviteWithProject[]; total: number }> {
    const keys = [`account-${memberId.toValue()}`, "invites", `limit-${pagination.limit}`, `page-${pagination.page}`];
    if (filters.status !== undefined && typeof filters.status === "string") {
      keys.push(`status-${filters.status}`);
    }

    const CACHE_KEY = this.cache.createKey(keys);
    const cacheHit = await this.cache.get(CACHE_KEY);

    if (cacheHit) {
      const { invites, total } = JSON.parse(cacheHit) as { invites: Array<PrismaInvitesWithProject>; total: number };

      return {
        invites: invites.map(InviteWithProjectMapper.toDomain),
        total,
      };
    }

    const filter = this.makeStatusFilter(filters.status);

    const [invites, total] = await Promise.all([
      this.prismaConnection.projectInvites.findMany({
        where: {
          memberId: memberId.toValue(),
          ...filter,
        },
        select: {
          id: true,
          memberId: true,
          status: true,
          createdAt: true,
          expiresAt: true,
          projectId: true,
          project: {
            select: {
              name: true,
              createdAt: true,
              description: true,
              iconUrl: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prismaConnection.projectInvites.count({
        where: {
          memberId: memberId.toValue(),
          ...filter,
        },
      }),
    ]);

    await this.cache.set(CACHE_KEY, JSON.stringify({ invites, total }));

    return {
      invites: invites.map(InviteWithProjectMapper.toDomain),
      total: total,
    };
  }

  private makeStatusFilter(status?: "pending" | "accepted" | "declined") {
    switch (status) {
      case "pending":
        return {
          status: InvitationStatusValues.Pending,
        };
      case "accepted":
        return {
          status: InvitationStatusValues.Accepted,
        };
      case "declined":
        return {
          status: InvitationStatusValues.Declined,
        };
      default:
        return {};
    }
  }
}

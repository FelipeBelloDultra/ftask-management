import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

import { Invite } from "../../domain/entity/invite";

export interface FetchManyByMemberIdFilters {
  status?: "pending" | "accepted" | "declined";
}

export interface InviteRepository {
  findById(inviteId: UniqueEntityID): Promise<Invite | null>;
  save(invite: Invite): Promise<void>;
  create(invite: Invite): Promise<void>;
  findLastByMemberId(inviteId: UniqueEntityID): Promise<Invite | null>;
  fetchManyByMemberId(
    memberId: UniqueEntityID,
    pagination: Pagination,
    filters: FetchManyByMemberIdFilters,
  ): Promise<{ invites: Invite[]; total: number }>;
}

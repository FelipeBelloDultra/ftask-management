import { UniqueEntityID } from "@/core/entity/unique-entity-id";

import { Invite } from "../../domain/entity/invite";

export interface InviteRepository {
  findById(inviteId: UniqueEntityID): Promise<Invite | null>;
  save(invite: Invite): Promise<void>;
  create(invite: Invite): Promise<void>;
  findLastByMemberId(inviteId: UniqueEntityID): Promise<Invite | null>;
}

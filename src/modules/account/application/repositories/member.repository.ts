import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Member } from "~/account/domain/entity/member";

export interface MemberRepository {
  create(member: Member): Promise<void>;
  findByAccountAndProjectId(accountId: UniqueEntityID, projectId: UniqueEntityID): Promise<Member | null>;
  findById(id: UniqueEntityID): Promise<Member | null>;
}

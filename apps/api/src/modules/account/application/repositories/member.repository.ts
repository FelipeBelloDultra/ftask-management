import { Member } from "~/account/domain/entity/member";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface MemberRepository {
  create(member: Member): Promise<void>;
  findByAccountAndProjectId(accountId: UniqueEntityID, projectId: UniqueEntityID): Promise<Member | null>;
  findById(id: UniqueEntityID): Promise<Member | null>;
}

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Member } from "@/modules/account/domain/entity/member";

export interface MemberRepository {
  create(member: Member): Promise<void>;
  findById(id: UniqueEntityID): Promise<Member | null>;
  findByAccountId(accountId: UniqueEntityID): Promise<Member | null>;
}

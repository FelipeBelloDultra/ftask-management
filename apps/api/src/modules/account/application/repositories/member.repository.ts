import { Member } from "~/account/domain/entity/member";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export interface MemberRepository {
  create(member: Member): Promise<void>;
  findById(id: UniqueEntityID): Promise<Member | null>;
  findByAccountId(accountId: UniqueEntityID): Promise<Member | null>;
}

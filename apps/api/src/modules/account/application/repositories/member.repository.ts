import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Member } from "~/account/domain/entity/member";

export abstract class MemberRepository {
  public abstract create(member: Member): Promise<void>;
  public abstract findByAccountAndProjectId(
    accountId: UniqueEntityID,
    projectId: UniqueEntityID,
  ): Promise<Member | null>;
  public abstract findById(id: UniqueEntityID): Promise<Member | null>;
}

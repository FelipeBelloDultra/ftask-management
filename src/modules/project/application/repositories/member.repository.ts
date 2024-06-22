import { Member } from "~/modules/project/domain/entity/member";

export abstract class MemberRepository {
  public abstract create(member: Member): Promise<void>;
  public abstract findByUserEmailAndProjectId(email: string, projectId: string): Promise<Member | null>;
}

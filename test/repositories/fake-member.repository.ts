import { MemberRepository } from "~/modules/project/application/repositories/member.repository";
import { Member } from "~/modules/project/domain/entity/member";

export class FakeMemberRepository implements MemberRepository {
  public readonly members: Member[] = [];

  public async create(member: Member): Promise<void> {
    this.members.push(member);
  }

  public async findByUserEmailAndProjectId(email: string, projectId: string): Promise<Member | null> {
    const member = this.members.find(
      (member) => member.values.userEmail === email && member.values.projectId.toValue() === projectId,
    );

    return member || null;
  }
}

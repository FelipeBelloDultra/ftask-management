import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { MemberRepository } from "~/account/application/repositories/member.repository";
import type { Member } from "~/account/domain/entity/member";

export class FakeMemberRepository implements MemberRepository {
  public readonly members: Member[] = [];

  public async create(member: Member): Promise<void> {
    this.members.push(member);
  }

  public async findByAccountAndProjectId(accountId: UniqueEntityID, projectId: UniqueEntityID): Promise<Member | null> {
    const member = this.members.find(
      (member) => member.values.accountId.equals(accountId) && member.values.projectId.equals(projectId),
    );

    return member || null;
  }

  public async findById(id: UniqueEntityID): Promise<Member | null> {
    const member = this.members.find((member) => member.id.equals(id));

    return member || null;
  }
}

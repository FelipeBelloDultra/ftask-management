import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { MemberRepository } from "@/modules/account/application/repositories/member.repository";
import { Member } from "@/modules/account/domain/entity/member";

export class FakeMemberRepository implements MemberRepository {
  public readonly members: Member[] = [];

  public async create(member: Member): Promise<void> {
    this.members.push(member);
  }

  public async findById(id: UniqueEntityID): Promise<Member | null> {
    const member = this.members.find((member) => member.id.equals(id));

    return member || null;
  }

  public async findByAccountId(accountId: UniqueEntityID): Promise<Member | null> {
    const member = this.members.find((member) => member.accountId.equals(accountId));

    return member || null;
  }
}

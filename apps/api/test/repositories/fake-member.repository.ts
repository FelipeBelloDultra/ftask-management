import { MemberRepository } from "~/account/application/repositories/member.repository";
import { Member } from "~/account/domain/entity/member";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

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
    const member = this.members.find((member) => member.values.accountId.equals(accountId));

    return member || null;
  }
}

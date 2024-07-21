import { Member, MemberProps } from "~/account/domain/entity/member";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export function makeMember(override: Partial<MemberProps> = {}, id?: UniqueEntityID): Member {
  const member = Member.create(
    {
      accountId: UniqueEntityID.create(),
      ...override,
    },
    id,
  );

  return member;
}

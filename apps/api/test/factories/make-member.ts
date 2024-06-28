import { faker } from "@faker-js/faker";

import { Member, MemberProps } from "~/account/domain/entity/member";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export function makeMember(override: Partial<MemberProps> = {}, id?: UniqueEntityID): Member {
  const member = Member.create(
    {
      accountEmail: faker.internet.email(),
      accountName: faker.person.fullName(),
      accountId: UniqueEntityID.create(),
      projectId: UniqueEntityID.create(),
      ...override,
    },
    id,
  );

  return member;
}

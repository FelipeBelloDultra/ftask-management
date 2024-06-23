import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Member, MemberProps } from "~/project/domain/entity/member";

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

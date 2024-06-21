import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Member, MemberProps } from "~/modules/project/domain/entity/member";

export function makeMember(override: Partial<MemberProps> = {}, id?: UniqueEntityID): Member {
  const member = Member.create(
    {
      userEmail: faker.internet.email(),
      userName: faker.person.fullName(),
      userId: UniqueEntityID.create(),
      projectId: UniqueEntityID.create(),
      ...override,
    },
    id,
  );

  return member;
}

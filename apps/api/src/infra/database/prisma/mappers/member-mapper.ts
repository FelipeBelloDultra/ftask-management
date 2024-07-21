import { Member as PrismaMember } from "@prisma/client";

import { Member } from "~/account/domain/entity/member";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

export class MemberMapper {
  public static toDomain(prismaMember: PrismaMember): Member {
    return Member.create(
      {
        accountId: UniqueEntityID.create(prismaMember.accountId),
      },
      UniqueEntityID.create(prismaMember.id),
    );
  }

  public static toPersistence(member: Member): PrismaMember {
    return {
      id: member.id.toValue(),
      accountId: member.values.accountId.toValue(),
    };
  }
}

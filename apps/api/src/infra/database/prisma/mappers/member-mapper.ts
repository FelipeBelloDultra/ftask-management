import { Member as PrismaMember } from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Member } from "@/modules/account/domain/entity/member";

export class MemberMapper {
  public static toDomain(prismaMember: PrismaMember): Member {
    return Member.create(
      {
        accountId: UniqueEntityID.create(prismaMember.accountId),
        projectId: UniqueEntityID.create(prismaMember.projectId),
      },
      UniqueEntityID.create(prismaMember.id),
    );
  }

  public static toPersistence(member: Member): PrismaMember {
    return {
      id: member.id.toValue(),
      accountId: member.accountId.toValue(),
      projectId: member.projectId.toValue(),
    };
  }
}

import { Member } from "~/account/domain/entity/member";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

import type { Member as PrismaMember } from "@prisma/client";

interface PrismaMemberWithAccount {
  id: string;
  projectId: string;
  account: {
    id: string;
    email: string;
    password: string;
    name: string;
  };
}

export class MemberMapper {
  public static toDomain(prismaMember: PrismaMemberWithAccount): Member {
    return Member.create(
      {
        accountEmail: prismaMember.account.email,
        accountName: prismaMember.account.name,
        projectId: UniqueEntityID.create(prismaMember.projectId),
        accountId: UniqueEntityID.create(prismaMember.account.id),
      },
      UniqueEntityID.create(prismaMember.id),
    );
  }

  public static toPersistence(member: Member): PrismaMember {
    return {
      projectId: member.values.projectId.toValue(),
      accountId: member.values.accountId.toValue(),
      id: member.id.toValue(),
      role: "member",
    };
  }
}

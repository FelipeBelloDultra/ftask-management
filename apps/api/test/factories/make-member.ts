import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { MemberMapper } from "@/infra/database/prisma/mappers/member-mapper";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { Member, MemberProps } from "@/modules/account/domain/entity/member";

export function makeMember(override: Partial<MemberProps> = {}, id?: UniqueEntityID): Member {
  const member = Member.create(
    {
      accountId: UniqueEntityID.create(),
      projectId: UniqueEntityID.create(),
      ...override,
    },
    id,
  );

  return member;
}

@injectable()
export class MemberFactory {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async makePrismaMember(override: Partial<MemberProps> = {}, id?: UniqueEntityID) {
    const member = makeMember(override, id);

    await this.prismaConnection.member.create({
      data: MemberMapper.toPersistence(member),
    });

    return member;
  }
}

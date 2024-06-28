import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { MemberRepository } from "~/modules/account/application/repositories/member.repository";
import { Member } from "~/modules/account/domain/entity/member";

import { MemberMapper } from "../mappers/member-mapper";
import { PrismaConnection } from "../prisma-connection";

export class PrismaMemberRepository implements MemberRepository {
  public constructor(private readonly prismaConnection: PrismaConnection) {}

  public async create(member: Member): Promise<void> {
    await this.prismaConnection.member.create({
      data: MemberMapper.toPersistence(member),
    });
  }

  public async findByAccountAndProjectId(accountId: UniqueEntityID, projectId: UniqueEntityID): Promise<Member | null> {
    const member = await this.prismaConnection.member.findUnique({
      where: {
        projectId_accountId: {
          accountId: accountId.toValue(),
          projectId: projectId.toValue(),
        },
      },
      select: {
        account: true,
        projectId: true,
        id: true,
      },
    });

    if (!member) return null;

    return MemberMapper.toDomain(member);
  }

  public async findById(id: UniqueEntityID): Promise<Member | null> {
    const member = await this.prismaConnection.member.findUnique({
      where: {
        id: id.toValue(),
      },
      select: {
        account: true,
        projectId: true,
        id: true,
      },
    });

    if (!member) return null;

    return MemberMapper.toDomain(member);
  }
}

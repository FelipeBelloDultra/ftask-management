import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { MemberRepository } from "@/modules/account/application/repositories/member.repository";
import { Member } from "@/modules/account/domain/entity/member";

import { MemberMapper } from "../mappers/member-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaMemberRepository implements MemberRepository {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async create(member: Member): Promise<void> {
    await this.prismaConnection.member.create({
      data: MemberMapper.toPersistence(member),
    });
  }

  public async findById(id: UniqueEntityID): Promise<Member | null> {
    const member = await this.prismaConnection.member.findUnique({
      where: {
        id: id.toValue(),
      },
    });

    if (!member) return null;

    return MemberMapper.toDomain(member);
  }

  public async findByAccountId(accountId: UniqueEntityID): Promise<Member | null> {
    const member = await this.prismaConnection.member.findUnique({
      where: {
        accountId: accountId.toValue(),
      },
    });

    if (!member) return null;

    return MemberMapper.toDomain(member);
  }

  public async findByAccountAndProjectId(accountId: UniqueEntityID, projectId: UniqueEntityID): Promise<Member | null> {
    const member = await this.prismaConnection.member.findUnique({
      where: {
        accountId_projectId: {
          accountId: accountId.toValue(),
          projectId: projectId.toValue(),
        },
      },
    });

    if (!member) return null;

    return MemberMapper.toDomain(member);
  }
}

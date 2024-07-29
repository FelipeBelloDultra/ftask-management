import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { DomainEvents } from "@/core/events/domain-events";
import { ProjectMemberRepository } from "@/modules/project/application/repositories/project-member.repository";
import { MemberWithProject } from "@/modules/project/domain/entity/member-with-project";

import { MemberWithProjectMapper } from "../mappers/member-with-project-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaProjectMemberRepository implements ProjectMemberRepository {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async findByMemberAndProjectId(memberId: UniqueEntityID, projectId: UniqueEntityID) {
    const memberWithProject = await this.prismaConnection.projectHasMember.findUnique({
      where: {
        projectId_memberId: {
          memberId: memberId.toValue(),
          projectId: projectId.toValue(),
        },
      },
      include: {
        member: true,
        project: true,
      },
    });

    if (!memberWithProject) {
      return null;
    }

    return MemberWithProjectMapper.toDomain(memberWithProject);
  }

  public async create(memberWithProject: MemberWithProject): Promise<void> {
    await this.prismaConnection.projectHasMember.create({
      data: MemberWithProjectMapper.toPersistence(memberWithProject),
    });

    DomainEvents.dispatchEventsForAggregate(memberWithProject.id);
  }
}

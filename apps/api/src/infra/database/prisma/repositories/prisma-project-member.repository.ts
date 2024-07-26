import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { DomainEvents } from "~/core/events/domain-events";
import { ProjectMemberRepository } from "~/modules/project/application/repositories/project-member.repository";
import { ProjectMember } from "~/modules/project/domain/entity/project-member";

import { ProjectMemberMapper } from "../mappers/project-member-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaProjectMemberRepository implements ProjectMemberRepository {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async findByMemberAndProjectId(memberId: UniqueEntityID, projectId: UniqueEntityID) {
    const projectMember = await this.prismaConnection.projectHasMember.findUnique({
      where: {
        projectId_memberId: {
          memberId: memberId.toValue(),
          projectId: projectId.toValue(),
        },
      },
    });

    if (!projectMember) {
      return null;
    }

    return ProjectMemberMapper.toDomain(projectMember);
  }

  public async create(projectMember: ProjectMember): Promise<void> {
    await this.prismaConnection.projectHasMember.create({
      data: ProjectMemberMapper.toPersistence(projectMember),
    });

    DomainEvents.dispatchEventsForAggregate(projectMember.id);
  }
}

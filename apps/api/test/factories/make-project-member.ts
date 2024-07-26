import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ProjectMemberMapper } from "@/infra/database/prisma/mappers/project-member-mapper";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { ProjectMember, ProjectMemberProps } from "@/modules/project/domain/entity/project-member";

export function makeProjectMember(override: Partial<ProjectMemberProps> = {}): ProjectMember {
  const projectMember = ProjectMember.create({
    memberId: UniqueEntityID.create(),
    projectId: UniqueEntityID.create(),
    ...override,
  });

  return projectMember;
}

@injectable()
export class ProjectMemberFactory {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async makePrismaProjectMember(override: Partial<ProjectMemberProps> = {}) {
    const projectMember = makeProjectMember(override);

    await this.prismaConnection.projectHasMember.create({
      data: ProjectMemberMapper.toPersistence(projectMember),
    });

    return projectMember;
  }
}

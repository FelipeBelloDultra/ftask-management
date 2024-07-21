import { ProjectHasMember as PrismaProjectMember } from "@prisma/client";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { ProjectMember } from "~/project/domain/entity/project-member";

export class ProjectMemberMapper {
  public static toDomain(prismaMember: PrismaProjectMember): ProjectMember {
    return ProjectMember.create({
      memberId: UniqueEntityID.create(prismaMember.memberId),
      projectId: UniqueEntityID.create(prismaMember.projectId),
    });
  }

  public static toPersistence(projectMember: ProjectMember): PrismaProjectMember {
    return {
      memberId: projectMember.memberId.toValue(),
      projectId: projectMember.projectId.toValue(),
    };
  }
}

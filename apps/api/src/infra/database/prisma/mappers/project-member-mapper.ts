import { ProjectHasMember as PrismaProjectMember } from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ProjectMember } from "@/modules/project/domain/entity/project-member";

export class ProjectMemberMapper {
  public static toDomain(prismaMember: PrismaProjectMember): ProjectMember {
    return ProjectMember.create(
      {
        memberId: UniqueEntityID.create(prismaMember.memberId),
        projectId: UniqueEntityID.create(prismaMember.projectId),
      },
      UniqueEntityID.create(prismaMember.id),
    );
  }

  public static toPersistence(projectMember: ProjectMember): PrismaProjectMember {
    return {
      id: projectMember.id.toValue(),
      memberId: projectMember.memberId.toValue(),
      projectId: projectMember.projectId.toValue(),
    };
  }
}

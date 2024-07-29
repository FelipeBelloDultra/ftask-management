import {
  Member as PrismaMember,
  Project as PrismaProject,
  ProjectHasMember as PrismaProjectMember,
} from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { MemberWithProject } from "@/modules/project/domain/entity/member-with-project";

import { MemberMapper } from "./member-mapper";
import { ProjectMapper } from "./project-mapper";

type ToDomainPrismaProjectMember = PrismaProjectMember & { project: PrismaProject; member: PrismaMember };

export class MemberWithProjectMapper {
  public static toDomain(prismaProjectMember: ToDomainPrismaProjectMember): MemberWithProject {
    return MemberWithProject.create(
      {
        member: MemberMapper.toDomain(prismaProjectMember.member),
        project: ProjectMapper.toDomain(prismaProjectMember.project),
      },
      UniqueEntityID.create(prismaProjectMember.id),
    );
  }

  public static toPersistence(memberWithProject: MemberWithProject): PrismaProjectMember {
    return {
      id: memberWithProject.id.toValue(),
      memberId: memberWithProject.member.id.toValue(),
      projectId: memberWithProject.project.id.toValue(),
    };
  }
}

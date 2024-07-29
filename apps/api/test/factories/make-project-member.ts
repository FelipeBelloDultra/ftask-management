import { inject, injectable } from "tsyringe";

import { MemberWithProjectMapper } from "@/infra/database/prisma/mappers/member-with-project-mapper";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { MemberWithProject, MemberWithProjectProps } from "@/modules/project/domain/entity/member-with-project";

import { makeMember } from "./make-member";
import { makeProject } from "./make-project";

export function makeMemberWithProject(override: Partial<MemberWithProjectProps> = {}): MemberWithProject {
  const projectMember = MemberWithProject.create({
    member: makeMember(),
    project: makeProject(),
    ...override,
  });

  return projectMember;
}

@injectable()
export class MemberWithProjectFactory {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async makePrismaMemberWithProject(override: Partial<MemberWithProjectProps> = {}) {
    const projectMember = makeMemberWithProject(override);

    await this.prismaConnection.projectHasMember.create({
      data: MemberWithProjectMapper.toPersistence(projectMember),
    });

    return projectMember;
  }
}

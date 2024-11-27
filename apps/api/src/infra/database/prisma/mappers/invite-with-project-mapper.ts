import { ProjectInvites as PrismaProjectInvites } from "@prisma/client";

import { IconUrl } from "@/modules/project/domain/entity/value-objects/icon-url";
import { InviteWithProject } from "@/modules/project/domain/entity/value-objects/invite-with-project";
import { Slug } from "@/modules/project/domain/entity/value-objects/slug";

import { InviteMapper } from "./invite-mapper";

export type PrismaInvitesWithProject = PrismaProjectInvites & {
  project: {
    createdAt: Date;
    slug: string;
    iconUrl: string | null;
    name: string;
    description: string | null;
  };
};

export class InviteWithProjectMapper {
  public static toDomain(prismaInvitesWithProject: PrismaInvitesWithProject): InviteWithProject {
    const invite = InviteMapper.toDomain(prismaInvitesWithProject);

    return InviteWithProject.create({
      invite,
      project: {
        description: prismaInvitesWithProject.project.description,
        name: prismaInvitesWithProject.project.name,
        slug: Slug.create(prismaInvitesWithProject.project.slug),
        createdAt: prismaInvitesWithProject.createdAt,
        iconUrl: prismaInvitesWithProject.project.iconUrl
          ? IconUrl.create(prismaInvitesWithProject.project.iconUrl)
          : null,
      },
    });
  }
}

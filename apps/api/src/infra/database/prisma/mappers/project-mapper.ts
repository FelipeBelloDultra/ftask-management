import { Project as PrismaProject } from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Project } from "@/modules/project/domain/entity/project";
import { DueDate } from "@/modules/project/domain/entity/value-objects/due-date";
import { IconUrl } from "@/modules/project/domain/entity/value-objects/icon-url";
import { ProjectStatus, ProjectStatusValues } from "@/modules/project/domain/entity/value-objects/project-status";
import { Slug } from "@/modules/project/domain/entity/value-objects/slug";

export class ProjectMapper {
  public static toDomain(prismaProject: PrismaProject): Project {
    const status = {
      deleted: ProjectStatusValues.Deleted,
      archived: ProjectStatusValues.Archived,
      active: ProjectStatusValues.Active,
    };

    return Project.create(
      {
        ownerId: UniqueEntityID.create(prismaProject.ownerId),
        description: prismaProject.description,
        dueDate: prismaProject.dueDate ? DueDate.create(prismaProject.dueDate) : null,
        status: ProjectStatus.create(status[prismaProject.status]),
        name: prismaProject.name,
        slug: Slug.create(prismaProject.slug),
        createdAt: prismaProject.createdAt,
        updatedAt: prismaProject.updatedAt,
        deletedAt: prismaProject.deletedAt,
        iconUrl: prismaProject.iconUrl ? IconUrl.create(prismaProject.iconUrl) : null,
      },
      UniqueEntityID.create(prismaProject.id),
    );
  }

  public static toPersistence(project: Project): PrismaProject {
    return {
      id: project.id.toValue(),
      iconUrl: project.iconUrl?.value || null,
      name: project.name,
      slug: project.slug.value,
      description: project.description,
      dueDate: project.dueDate ? project.dueDate.value : null,
      ownerId: project.ownerId.toValue(),
      status: project.status.value,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      deletedAt: project.deletedAt,
    };
  }
}

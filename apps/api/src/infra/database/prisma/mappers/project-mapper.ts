import { Project as PrismaProject } from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Project } from "@/modules/project/domain/entity/project";
import { DueDate } from "@/modules/project/domain/entity/value-objects/due-date";
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
        description: prismaProject.description,
        dueDate: prismaProject.due_date ? DueDate.create(prismaProject.due_date) : null,
        status: ProjectStatus.create(status[prismaProject.status]),
        name: prismaProject.name,
        ownerId: UniqueEntityID.create(prismaProject.ownerId),
        slug: Slug.create(prismaProject.slug),
        createdAt: prismaProject.createdAt,
        updatedAt: prismaProject.updatedAt,
        deletedAt: prismaProject.deletedAt,
      },
      UniqueEntityID.create(prismaProject.id),
    );
  }

  public static toPersistence(project: Project): PrismaProject {
    return {
      id: project.id.toValue(),
      name: project.name,
      slug: project.slug.value,
      description: project.description,
      ownerId: project.ownerId.toValue(),
      due_date: project.dueDate ? project.dueDate.value : null,
      status: project.status.value,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      deletedAt: project.deletedAt,
    };
  }
}

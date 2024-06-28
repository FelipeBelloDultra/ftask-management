import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { ProjectRepository } from "~/modules/project/application/repositories/project.repository";
import { Project } from "~/modules/project/domain/entity/project";
import { Slug } from "~/modules/project/domain/entity/value-objects/slug";

import { ProjectMapper } from "../mappers/project-mapper";
import { PrismaConnection } from "../prisma-connection";

export class PrismaProjectRepository implements ProjectRepository {
  public constructor(private readonly prismaConnection: PrismaConnection) {}

  public async findById(projectId: UniqueEntityID): Promise<Project | null> {
    const project = await this.prismaConnection.project.findUnique({
      where: {
        id: projectId.toValue(),
      },
    });

    if (!project) return null;

    return ProjectMapper.toDomain(project);
  }

  public async findBySlug(slug: Slug): Promise<Project | null> {
    const project = await this.prismaConnection.project.findUnique({
      where: {
        slug: slug.value,
      },
    });

    if (!project) return null;

    return ProjectMapper.toDomain(project);
  }

  public async create(project: Project): Promise<void> {
    await this.prismaConnection.project.create({
      data: ProjectMapper.toPersistence(project),
    });
  }
}

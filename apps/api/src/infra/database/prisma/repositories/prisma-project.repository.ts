import { Project as PrismaProject } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { CacheRepository } from "@/infra/cache/cache.repository";
import { ProjectRepository } from "@/modules/project/application/repositories/project.repository";
import { Project } from "@/modules/project/domain/entity/project";
import { Slug } from "@/modules/project/domain/entity/value-objects/slug";

import { ProjectMapper } from "../mappers/project-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaProjectRepository implements ProjectRepository {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
    @inject("CacheRepository")
    private readonly cache: CacheRepository,
  ) {}

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
    await Promise.all([
      this.prismaConnection.project.create({
        data: ProjectMapper.toPersistence(project),
      }),
      this.cache.delete(`account-${project.ownerId.toValue()}:projects:*`),
    ]);
  }

  public async fetchManyByOwnerId(
    ownerId: UniqueEntityID,
    pagination: Pagination,
  ): Promise<{
    projects: Array<Project>;
    total: number;
  }> {
    const CACHE_KEY = `account-${ownerId.toValue()}:projects:limit-${pagination.limit}:page-${pagination.page}`;
    const cacheHit = await this.cache.get(CACHE_KEY);

    if (cacheHit) {
      const { projects, total } = JSON.parse(cacheHit) as { projects: Array<PrismaProject>; total: number };

      return {
        projects: projects.map(ProjectMapper.toDomain),
        total,
      };
    }

    const [projects, total] = await Promise.all([
      this.prismaConnection.project.findMany({
        take: pagination.take,
        skip: pagination.skip,
        where: {
          ownerId: ownerId.toValue(),
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      }),
      this.prismaConnection.project.count({
        where: {
          ownerId: ownerId.toValue(),
        },
      }),
    ]);

    await this.cache.set(CACHE_KEY, JSON.stringify({ projects, total }));

    return {
      projects: projects.map(ProjectMapper.toDomain),
      total,
    };
  }
}

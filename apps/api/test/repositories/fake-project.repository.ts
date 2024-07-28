import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ProjectRepository } from "@/modules/project/application/repositories/project.repository";
import { Project } from "@/modules/project/domain/entity/project";
import { Slug } from "@/modules/project/domain/entity/value-objects/slug";

export class FakeProjectRepository implements ProjectRepository {
  public readonly projects: Project[] = [];

  public async findById(projectId: UniqueEntityID): Promise<Project | null> {
    const project = this.projects.find((project) => project.id.equals(projectId));

    return project || null;
  }

  public async findBySlug(slug: Slug): Promise<Project | null> {
    const project = this.projects.find((project) => project.slug.value === slug.value);

    return project || null;
  }

  public async create(project: Project): Promise<void> {
    this.projects.push(project);
  }
}

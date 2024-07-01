import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { ProjectRepository } from "~/project/application/repositories/project.repository";
import { Project } from "~/project/domain/entity/project";
import { Slug } from "~/project/domain/entity/value-objects/slug";

export class FakeProjectRepository implements ProjectRepository {
  public readonly projects: Project[] = [];

  public async findById(projectId: UniqueEntityID): Promise<Project | null> {
    const project = this.projects.find((project) => project.id.equals(projectId));

    return project || null;
  }

  public async findBySlug(slug: Slug): Promise<Project | null> {
    const project = this.projects.find((project) => project.values.slug.value === slug.value);

    return project || null;
  }

  public async create(project: Project): Promise<void> {
    this.projects.push(project);
  }
}
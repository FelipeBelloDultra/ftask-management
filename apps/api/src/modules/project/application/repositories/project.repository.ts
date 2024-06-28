import type { UniqueEntityID } from "~/core/entity/unique-entity-id";
import type { Project } from "~/project/domain/entity/project";
import type { Slug } from "~/project/domain/entity/value-objects/slug";

export abstract class ProjectRepository {
  public abstract findById(projectId: UniqueEntityID): Promise<Project | null>;
  public abstract findBySlug(slug: Slug): Promise<Project | null>;
  public abstract create(project: Project): Promise<void>;
}

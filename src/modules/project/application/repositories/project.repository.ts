import { Project } from "~/modules/project/domain/entity/project";
import { Slug } from "~/modules/project/domain/entity/value-objects/slug";

export abstract class ProjectRepository {
  public abstract findById(projectId: string): Promise<Project | null>;
  public abstract findBySlug(slug: Slug): Promise<Project | null>;
  public abstract create(project: Project): Promise<void>;
}

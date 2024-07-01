import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Project } from "~/project/domain/entity/project";
import { Slug } from "~/project/domain/entity/value-objects/slug";

export interface ProjectRepository {
  findById(projectId: UniqueEntityID): Promise<Project | null>;
  findBySlug(slug: Slug): Promise<Project | null>;
  create(project: Project): Promise<void>;
}

import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Project } from "@/modules/project/domain/entity/project";
import { Slug } from "@/modules/project/domain/entity/value-objects/slug";

export interface FetchManyByOwnerIdFilters {
  role?: "owner" | "member";
}

export interface ProjectRepository {
  findById(projectId: UniqueEntityID): Promise<Project | null>;
  findBySlug(slug: Slug): Promise<Project | null>;
  create(project: Project): Promise<void>;
  fetchManyByOwnerId(
    ownerId: UniqueEntityID,
    pagination: Pagination,
    filters: FetchManyByOwnerIdFilters,
  ): Promise<{ projects: Project[]; total: number }>;
}

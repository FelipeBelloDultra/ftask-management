import { Project } from "@/modules/project/domain/entity/project";

export class ProjectPresenter {
  public static toHTTP(project: Project) {
    return {
      id: project.id.toValue(),
      name: project.name,
      slug: project.slug.value,
      description: project.description || null,
      owner_id: project.ownerId.toValue(),
      status: project.status.value,
      due_date: project.dueDate?.value || null,
      created_at: project.createdAt,
      updated_at: project.updatedAt,
    };
  }
}

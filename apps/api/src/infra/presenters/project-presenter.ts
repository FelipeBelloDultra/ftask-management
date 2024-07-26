import { Project } from "@/modules/project/domain/entity/project";

export class ProjectPresenter {
  public static toHTTP(project: Project) {
    return {
      id: project.id.toValue(),
      name: project.values.name,
      slug: project.values.slug.value,
      description: project.values.description || null,
      owner_id: project.values.ownerId.toValue(),
      status: project.values.status.value,
      due_date: project.values.dueDate?.value || null,
      created_at: project.values.createdAt,
      updated_at: project.values.updatedAt,
    };
  }
}

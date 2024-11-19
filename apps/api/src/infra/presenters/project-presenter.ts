import { Project } from "@/modules/project/domain/entity/project";

export class ProjectPresenter {
  public static toHTTP(project: Project, callerId?: string) {
    return {
      id: project.id.toValue(),
      name: project.name,
      slug: project.slug.value,
      description: project.description || null,
      status: project.status.value,
      due_date: project.dueDate?.value || null,
      created_at: project.createdAt,
      icon_url: project.iconUrl?.value || null,
      updated_at: project.updatedAt,
      ...(callerId && {
        is_owner: project.ownerId.toValue() === callerId,
      }),
    };
  }
}

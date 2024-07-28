import { Task } from "@/modules/project/domain/entity/task";

export class TaskPresenter {
  public static toHTTP(task: Task) {
    return {
      id: task.id.toValue(),
      project_id: task.projectId.toValue(),
      assignee_id: task.assigneeId.toValue(),
      slug: task.slug.value,
      status: task.status.value,
      title: task.title,
      description: task.description,
      due_date: task.dueDate.value,
      created_at: task.createdAt,
      updated_at: task.updatedAt,
    };
  }
}

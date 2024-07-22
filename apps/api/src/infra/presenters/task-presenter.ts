import { Task } from "~/modules/project/domain/entity/task";

export class TaskPresenter {
  public static toHTTP(task: Task) {
    return {
      data: {
        id: task.id.toValue(),
        project_id: task.values.projectId.toValue(),
        assignee_id: task.values.assigneeId.toValue(),
        slug: task.values.slug.value,
        status: task.values.status.value,
        title: task.values.title,
        description: task.values.description,
        due_date: task.values.dueDate.value,
        created_at: task.values.createdAt,
        updated_at: task.values.updatedAt,
      },
    };
  }
}

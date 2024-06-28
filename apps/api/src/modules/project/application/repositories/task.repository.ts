import type { Task } from "~/project/domain/entity/task";

export interface TaskRepository {
  create(task: Task): Promise<void>;
}

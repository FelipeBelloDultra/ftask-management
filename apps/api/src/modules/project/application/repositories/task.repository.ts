import { Task } from "@/modules/project/domain/entity/task";

export interface TaskRepository {
  create(task: Task): Promise<void>;
  save(task: Task): Promise<void>;
}

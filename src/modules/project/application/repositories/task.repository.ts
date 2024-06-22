import { Task } from "~/modules/project/domain/entity/task";

export abstract class TaskRepository {
  public abstract create(task: Task): Promise<void>;
}

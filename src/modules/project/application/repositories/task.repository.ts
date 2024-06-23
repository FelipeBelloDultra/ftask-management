import { Task } from "~/project/domain/entity/task";

export abstract class TaskRepository {
  public abstract create(task: Task): Promise<void>;
}

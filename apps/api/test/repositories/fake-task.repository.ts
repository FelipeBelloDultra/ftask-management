import { TaskRepository } from "~/project/application/repositories/task.repository";
import { Task } from "~/project/domain/entity/task";

export class FakeTaskRepository implements TaskRepository {
  public readonly tasks: Task[] = [];

  public async create(task: Task): Promise<void> {
    this.tasks.push(task);
  }
}

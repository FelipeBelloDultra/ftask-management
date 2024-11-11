import { TaskRepository } from "@/modules/project/application/repositories/task.repository";
import { Task } from "@/modules/project/domain/entity/task";

export class InMemoryTaskRepository implements TaskRepository {
  public readonly tasks: Task[] = [];

  public async create(task: Task): Promise<void> {
    this.tasks.push(task);
  }

  public async save(task: Task): Promise<void> {
    const index = this.tasks.findIndex((t) => t.id.equals(task.id));

    if (index !== -1) {
      this.tasks[index] = task;
    }
  }
}

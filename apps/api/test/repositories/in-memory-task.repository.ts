import { TaskRepository } from "@/modules/project/application/repositories/task.repository";
import { Task } from "@/modules/project/domain/entity/task";

export class InMemoryTaskRepository implements TaskRepository {
  public readonly tasks: Task[] = [];

  public async create(task: Task): Promise<void> {
    this.tasks.push(task);
  }
}

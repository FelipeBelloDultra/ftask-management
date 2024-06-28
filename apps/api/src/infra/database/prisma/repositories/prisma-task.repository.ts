import { TaskMapper } from "../mappers/task-mapper";

import type { TaskRepository } from "~/modules/project/application/repositories/task.repository";
import type { Task } from "~/modules/project/domain/entity/task";
import type { PrismaConnection } from "../prisma-connection";

export class PrismaTaskRepository implements TaskRepository {
  public constructor(private readonly prismaConnection: PrismaConnection) {}

  public async create(task: Task): Promise<void> {
    await this.prismaConnection.task.create({
      data: TaskMapper.toPersistence(task),
    });
  }
}

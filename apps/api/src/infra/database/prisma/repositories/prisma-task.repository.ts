import { TaskRepository } from "~/modules/project/application/repositories/task.repository";
import { Task } from "~/modules/project/domain/entity/task";

import { PrismaConnection } from "../prisma-connection";
import { TaskMapper } from "../mappers/task-mapper";

export class PrismaTaskRepository implements TaskRepository {
  public constructor(private readonly prismaConnection: PrismaConnection) {}

  public async create(task: Task): Promise<void> {
    await this.prismaConnection.task.create({
      data: TaskMapper.toPersistence(task),
    });
  }
}

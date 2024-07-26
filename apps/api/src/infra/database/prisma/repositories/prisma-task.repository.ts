import { inject, injectable } from "tsyringe";

import { TaskRepository } from "@/modules/project/application/repositories/task.repository";
import { Task } from "@/modules/project/domain/entity/task";

import { TaskMapper } from "../mappers/task-mapper";
import { PrismaConnection } from "../prisma-connection";

@injectable()
export class PrismaTaskRepository implements TaskRepository {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async create(task: Task): Promise<void> {
    await this.prismaConnection.task.create({
      data: TaskMapper.toPersistence(task),
    });
  }
}

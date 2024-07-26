import { faker } from "@faker-js/faker";
import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { TaskMapper } from "@/infra/database/prisma/mappers/task-mapper";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { Task, TaskProps } from "@/modules/project/domain/entity/task";
import { DueDate } from "@/modules/project/domain/entity/value-objects/due-date";

export function makeTask(override: Partial<TaskProps> = {}, id?: UniqueEntityID): Task {
  const task = Task.create(
    {
      dueDate: DueDate.create(new Date()),
      assigneeId: UniqueEntityID.create(),
      projectId: UniqueEntityID.create(),
      description: faker.lorem.sentence(),
      title: faker.lorem.words(4),
      ...override,
    },
    id,
  );

  return task;
}

@injectable()
export class TaskFactory {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async makePrismaTask(override: Partial<TaskProps> = {}, id?: UniqueEntityID) {
    const task = makeTask(override, id);

    await this.prismaConnection.task.create({
      data: TaskMapper.toPersistence(task),
    });

    return task;
  }
}

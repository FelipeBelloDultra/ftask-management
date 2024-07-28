import { Task as PrismaTask } from "@prisma/client";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Task } from "@/modules/project/domain/entity/task";
import { DueDate } from "@/modules/project/domain/entity/value-objects/due-date";
import { Slug } from "@/modules/project/domain/entity/value-objects/slug";
import { TaskStatus, TaskStatusValues } from "@/modules/project/domain/entity/value-objects/task-status";

export class TaskMapper {
  public static toDomain(prismaTask: PrismaTask): Task {
    const status = {
      deleted: TaskStatusValues.Deleted,
      done: TaskStatusValues.Done,
      in_progress: TaskStatusValues.InProgress,
      waiting: TaskStatusValues.Waiting,
    };

    return Task.create(
      {
        title: prismaTask.title,
        description: prismaTask.description,
        assigneeId: UniqueEntityID.create(prismaTask.assigneeId),
        dueDate: DueDate.create(prismaTask.due_date),
        projectId: UniqueEntityID.create(prismaTask.projectId),
        slug: Slug.create(prismaTask.slug),
        status: TaskStatus.create(status[prismaTask.status]),
        createdAt: prismaTask.createdAt,
        updatedAt: prismaTask.updatedAt,
        deletedAt: prismaTask.deletedAt,
      },
      UniqueEntityID.create(prismaTask.id),
    );
  }

  public static toPersistence(task: Task): PrismaTask {
    return {
      id: task.id.toValue(),
      assigneeId: task.assigneeId.toValue(),
      projectId: task.projectId.toValue(),
      title: task.title,
      description: task.description,
      due_date: task.dueDate.value,
      slug: task.slug.value,
      status: task.status.value,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      deletedAt: task.deletedAt,
    };
  }
}

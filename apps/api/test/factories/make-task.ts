import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Task, TaskProps } from "~/project/domain/entity/task";
import { DueDate } from "~/project/domain/entity/value-objects/due-date";

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

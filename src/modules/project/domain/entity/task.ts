import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";

import { Slug } from "./value-objects/slug";
import { TaskStatus } from "./value-objects/task-status";
import { DueDate } from "./value-objects/due-date";

export interface TaskProps {
  assigneeId: UniqueEntityID;
  projectId: UniqueEntityID;
  slug: Slug;
  status: TaskStatus;
  name: string;
  description: string;
  dueDate: DueDate;
}

export class Task extends Entity<TaskProps> {}

import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";

import { DueDate } from "./value-objects/due-date";
import { Slug } from "./value-objects/slug";
import { TaskStatus } from "./value-objects/task-status";

export interface TaskProps {
  assigneeId: UniqueEntityID;
  projectId: UniqueEntityID;
  slug: Slug;
  status: TaskStatus;
  title: string;
  description: string;
  dueDate: DueDate;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Task extends Entity<TaskProps> {
  private edited() {
    this.props.updatedAt = new Date();
  }

  public complete() {
    if (!this.values.status.canSetDone()) return;

    this.values.status.setDone();
    this.edited();
  }

  public wait() {
    if (!this.values.status.canSetWaiting()) return;

    this.values.status.setWaiting();
    this.edited();
  }

  public start() {
    if (!this.values.status.canSetInProgress()) return;

    this.values.status.setInProgress();
    this.edited();
  }

  public delete() {
    if (!this.values.status.canSetDeleted()) return;

    this.values.status.setDeleted();
    this.values.deletedAt = new Date();
    this.edited();
  }

  public isExpired() {
    return this.props.dueDate.isExpired();
  }

  public static create(
    props: Optional<TaskProps, "createdAt" | "updatedAt" | "status" | "slug" | "deletedAt">,
    id?: UniqueEntityID,
  ) {
    return new Task(
      {
        ...props,
        deletedAt: props.deletedAt ?? null,
        updatedAt: props.updatedAt ?? new Date(),
        createdAt: props.updatedAt ?? new Date(),
        status: props.status ?? TaskStatus.create(),
        slug: props.slug ?? Slug.createFromText(props.title),
      },
      id,
    );
  }
}

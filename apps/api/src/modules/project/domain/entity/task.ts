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
  public get assigneeId() {
    return this.props.assigneeId;
  }

  public get projectId() {
    return this.props.projectId;
  }

  public get slug() {
    return this.props.slug;
  }

  public get status() {
    return this.props.status;
  }

  public get title() {
    return this.props.title;
  }

  public get description() {
    return this.props.description;
  }

  public get dueDate() {
    return this.props.dueDate;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public get deletedAt() {
    return this.props.deletedAt;
  }

  private edited() {
    this.props.updatedAt = new Date();
  }

  public complete() {
    if (!this.props.status.canSetDone()) return;

    this.props.status.setDone();
    this.edited();
  }

  public wait() {
    if (!this.props.status.canSetWaiting()) return;

    this.props.status.setWaiting();
    this.edited();
  }

  public start() {
    if (!this.props.status.canSetInProgress()) return;

    this.props.status.setInProgress();
    this.edited();
  }

  public delete() {
    if (!this.props.status.canSetDeleted()) return;

    this.props.status.setDeleted();
    this.props.deletedAt = new Date();
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

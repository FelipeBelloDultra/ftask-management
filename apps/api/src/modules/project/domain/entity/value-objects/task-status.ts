import { ValueObject } from "@/core/entity/value-object";

export enum TaskStatusValues {
  Waiting = "waiting",
  InProgress = "in_progress",
  Done = "done",
  Deleted = "deleted",
}

export class TaskStatus extends ValueObject<TaskStatusValues> {
  public get value() {
    return this.props;
  }

  public canSetDone() {
    return this.props !== TaskStatusValues.Deleted && this.props !== TaskStatusValues.Done;
  }

  public canSetDeleted() {
    return this.props !== TaskStatusValues.Deleted;
  }

  public canSetInProgress() {
    return this.props !== TaskStatusValues.Deleted && this.props !== TaskStatusValues.InProgress;
  }

  public canSetWaiting() {
    return this.props !== TaskStatusValues.Deleted && this.props !== TaskStatusValues.Waiting;
  }

  public setDone() {
    this.props = TaskStatusValues.Done;
  }

  public setInProgress() {
    this.props = TaskStatusValues.InProgress;
  }

  public setWaiting() {
    this.props = TaskStatusValues.Waiting;
  }

  public setDeleted() {
    this.props = TaskStatusValues.Deleted;
  }

  public static create(value?: TaskStatusValues) {
    return new TaskStatus(value ?? TaskStatusValues.Waiting);
  }
}

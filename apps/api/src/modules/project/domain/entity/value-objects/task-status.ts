export enum TaskStatusValues {
  Waiting = "waiting",
  InProgress = "in_progress",
  Done = "done",
  Deleted = "deleted",
}

export class TaskStatus {
  private _value: TaskStatusValues;

  public get value() {
    return this._value;
  }

  private constructor(value: TaskStatusValues) {
    this._value = value;
  }

  public canSetDone() {
    return this._value !== TaskStatusValues.Deleted && this._value !== TaskStatusValues.Done;
  }

  public canSetDeleted() {
    return this._value !== TaskStatusValues.Deleted;
  }

  public canSetInProgress() {
    return this._value !== TaskStatusValues.Deleted && this._value !== TaskStatusValues.InProgress;
  }

  public canSetWaiting() {
    return this._value !== TaskStatusValues.Deleted && this._value !== TaskStatusValues.Waiting;
  }

  public setDone() {
    this._value = TaskStatusValues.Done;
  }

  public setInProgress() {
    this._value = TaskStatusValues.InProgress;
  }

  public setWaiting() {
    this._value = TaskStatusValues.Waiting;
  }

  public setDeleted() {
    this._value = TaskStatusValues.Deleted;
  }

  public static create(value?: TaskStatusValues) {
    return new TaskStatus(value ?? TaskStatusValues.Waiting);
  }
}

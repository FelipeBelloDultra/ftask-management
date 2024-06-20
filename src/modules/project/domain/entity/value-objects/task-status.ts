export enum TaskStatusValues {
  Waiting = "waiting",
  InProgress = "in-progress",
  Done = "done",
}

export class TaskStatus {
  private _value: TaskStatusValues;

  public get value() {
    return this._value;
  }

  private constructor(value: TaskStatusValues) {
    this._value = value;
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

  public static create(value?: TaskStatusValues) {
    return new TaskStatus(value ?? TaskStatusValues.Waiting);
  }
}

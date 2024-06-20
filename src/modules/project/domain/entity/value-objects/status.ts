export enum StatusValues {
  Active = "active",
  Deleted = "deleted",
  Archived = "archived",
}

export class Status {
  private _value: StatusValues;

  public get value() {
    return this._value;
  }

  private constructor(value: StatusValues) {
    this._value = value;
  }

  public canActivate() {
    return this._value === StatusValues.Archived;
  }

  public canArchive() {
    return this._value === StatusValues.Active;
  }

  public setDeleted() {
    this._value = StatusValues.Deleted;
  }

  public setArchived() {
    this._value = StatusValues.Archived;
  }

  public setActive() {
    this._value = StatusValues.Active;
  }

  public static create(status?: StatusValues) {
    return new Status(status ?? StatusValues.Active);
  }
}

export enum ProjectStatusValues {
  Active = "active",
  Deleted = "deleted",
  Archived = "archived",
}

export class ProjectStatus {
  private _value: ProjectStatusValues;

  public get value() {
    return this._value;
  }

  private constructor(value: ProjectStatusValues) {
    this._value = value;
  }

  public canActivate() {
    return this._value === ProjectStatusValues.Archived;
  }

  public canArchive() {
    return this._value === ProjectStatusValues.Active;
  }

  public setDeleted() {
    this._value = ProjectStatusValues.Deleted;
  }

  public setArchived() {
    this._value = ProjectStatusValues.Archived;
  }

  public setActive() {
    this._value = ProjectStatusValues.Active;
  }

  public static create(status?: ProjectStatusValues) {
    return new ProjectStatus(status ?? ProjectStatusValues.Active);
  }
}

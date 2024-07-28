import { ValueObject } from "@/core/entity/value-object";

export enum ProjectStatusValues {
  Active = "active",
  Deleted = "deleted",
  Archived = "archived",
}

export class ProjectStatus extends ValueObject<ProjectStatusValues> {
  public get value() {
    return this.props;
  }

  public canActivate() {
    return this.props === ProjectStatusValues.Archived;
  }

  public canArchive() {
    return this.props === ProjectStatusValues.Active;
  }

  public setDeleted() {
    this.props = ProjectStatusValues.Deleted;
  }

  public setArchived() {
    this.props = ProjectStatusValues.Archived;
  }

  public setActive() {
    this.props = ProjectStatusValues.Active;
  }

  public static create(status?: ProjectStatusValues) {
    return new ProjectStatus(status ?? ProjectStatusValues.Active);
  }
}

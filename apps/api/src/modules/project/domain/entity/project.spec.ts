import { makeProject } from "test/factories/make-project";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";

import { Project } from "./project";
import { DueDate } from "./value-objects/due-date";
import { ProjectStatusValues } from "./value-objects/project-status";

describe("Project", () => {
  it("should create a project", () => {
    const sut = makeProject();

    expect(sut).toBeInstanceOf(Project);
    expect(sut.id).toBeInstanceOf(UniqueEntityID);
  });

  it("should update time on archive/delete a project", () => {
    const date = new Date("2000-01-01T08:00:00");
    vi.setSystemTime(date);

    const sut = makeProject();

    sut.archive();
    expect(sut.values.updatedAt).toEqual(date);

    sut.delete();
    expect(sut.values.updatedAt).toEqual(date);
  });

  it("should archive a project", () => {
    const sut = makeProject();

    expect(sut.values.status.canArchive()).toBeTruthy();

    sut.archive();
    expect(sut.values.status.value).toBe(ProjectStatusValues.Archived);
    expect(sut.values.status.canArchive()).toBeFalsy();
  });

  it("should delete a project", () => {
    const sut = makeProject();

    sut.delete();
    expect(sut.values.status.value).toBe(ProjectStatusValues.Deleted);
    expect(sut.values.deletedAt).not.toBeNull();
  });

  it("should verify is project is expired", () => {
    const date = new Date("2000-01-01T08:00:00");
    vi.setSystemTime(date);

    const sut = makeProject({ dueDate: DueDate.create(new Date("2000-01-02T08:00:00")) });

    expect(sut.isExpired()).toBe(false);

    vi.setSystemTime(new Date("2000-01-03T08:00:00"));
    expect(sut.isExpired()).toBe(true);
  });

  it("should return false if project has no due date and call isExpired method", () => {
    const sut = makeProject({ dueDate: null });

    expect(sut.isExpired()).toBe(false);
  });

  it("should not be able to archive a deleted (or archived) project", () => {
    const sut = makeProject();

    sut.delete();
    sut.archive();

    expect(sut.values.status.value).toBe(ProjectStatusValues.Deleted);
  });

  it("should be able to reactivate a project", () => {
    const sut = makeProject();

    sut.archive();
    expect(sut.values.status.canActivate()).toBeTruthy();
    expect(sut.values.status.value).toBe(ProjectStatusValues.Archived);

    sut.reactivate();
    expect(sut.values.status.value).toBe(ProjectStatusValues.Active);
  });

  it("should not be able to reactivate a deleted (or active) project", () => {
    const sut = makeProject();

    sut.delete();
    expect(sut.values.status.canActivate()).toBeFalsy();

    sut.reactivate();
    expect(sut.values.status.value).toBe(ProjectStatusValues.Deleted);
  });

  afterAll(() => {
    vi.clearAllTimers();
  });
});

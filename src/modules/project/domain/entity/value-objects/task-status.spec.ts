import { TaskStatus, TaskStatusValues } from "./task-status";

describe("TaskStatus", () => {
  it("should be able to create a task status with default value", () => {
    const sut = TaskStatus.create();

    expect(sut.value).toBe(TaskStatusValues.Waiting);
  });

  it("should be able to update the task status value", () => {
    const sut = TaskStatus.create();

    sut.setDeleted();
    expect(sut.value).toBe(TaskStatusValues.Deleted);

    sut.setDone();
    expect(sut.value).toBe(TaskStatusValues.Done);

    sut.setInProgress();
    expect(sut.value).toBe(TaskStatusValues.InProgress);

    sut.setWaiting();
    expect(sut.value).toBe(TaskStatusValues.Waiting);
  });

  it("should be able to verify if can set done, deleted, in progress and waiting", () => {
    const sut = TaskStatus.create();

    sut.setWaiting();
    expect(sut.canSetDone()).toBeTruthy();
    expect(sut.canSetDeleted()).toBeTruthy();
    expect(sut.canSetInProgress()).toBeTruthy();
    expect(sut.canSetWaiting()).toBeFalsy();

    sut.setDeleted();
    expect(sut.canSetDone()).toBeFalsy();
    expect(sut.canSetDeleted()).toBeFalsy();
    expect(sut.canSetInProgress()).toBeFalsy();
    expect(sut.canSetWaiting()).toBeFalsy();

    sut.setDone();
    expect(sut.canSetDone()).toBeFalsy();
    expect(sut.canSetDeleted()).toBeTruthy();
    expect(sut.canSetInProgress()).toBeTruthy();
    expect(sut.canSetWaiting()).toBeTruthy();

    sut.setInProgress();
    expect(sut.canSetDone()).toBeTruthy();
    expect(sut.canSetDeleted()).toBeTruthy();
    expect(sut.canSetInProgress()).toBeFalsy();
    expect(sut.canSetWaiting()).toBeTruthy();
  });
});

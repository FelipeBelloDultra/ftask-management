import { makeTask } from "@/test/factories/make-task";

import { Task } from "./task";
import { DueDate } from "./value-objects/due-date";
import { TaskStatusValues } from "./value-objects/task-status";

describe("Task", () => {
  it("should be able to create a task instance", () => {
    const sut = makeTask();

    expect(sut).toBeInstanceOf(Task);
    expect(sut.assigneeId).toBeDefined();
    expect(sut.projectId).toBeDefined();
    expect(sut.slug).toBeDefined();
    expect(sut.status).toBeDefined();
    expect(sut.title).toBeDefined();
    expect(sut.description).toBeDefined();
    expect(sut.dueDate).toBeDefined();
    expect(sut.createdAt).toBeDefined();
    expect(sut.updatedAt).toBeDefined();
    expect(sut.deletedAt).toBeDefined();
  });

  it("should be able to complete a task", () => {
    const sut = makeTask();

    sut.complete();
    sut.complete();
    expect(sut.status.value).toBe(TaskStatusValues.Done);
  });

  it("should be able to wait a task", () => {
    const sut = makeTask();

    sut.complete();

    sut.wait();
    sut.wait();
    expect(sut.status.value).toBe(TaskStatusValues.Waiting);
  });

  it("should be able to start a task", () => {
    const sut = makeTask();

    sut.start();
    sut.start();
    expect(sut.status.value).toBe(TaskStatusValues.InProgress);
  });

  it("should be able to start a task", () => {
    const sut = makeTask();

    sut.delete();
    sut.delete();
    expect(sut.status.value).toBe(TaskStatusValues.Deleted);
    expect(sut.deletedAt).toBeInstanceOf(Date);
  });

  it("should be able to check if a task is expired", () => {
    const date = new Date("2000-01-01T08:00:00");
    vi.setSystemTime(date);

    const sut = makeTask({ dueDate: DueDate.create(new Date("2000-01-02T08:00:00")) });

    expect(sut.isExpired()).toBe(false);

    vi.setSystemTime(new Date("2000-01-03T08:00:00"));
    expect(sut.isExpired()).toBe(true);
  });

  afterAll(() => {
    vi.clearAllTimers();
  });
});

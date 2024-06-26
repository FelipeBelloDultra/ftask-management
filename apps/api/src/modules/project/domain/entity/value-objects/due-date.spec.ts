import { DueDate } from "./due-date";

describe("DueDate", () => {
  it("should be able to verify if a date is expired", () => {
    vi.useFakeTimers();

    const date = new Date("2000-01-01T08:00:00");
    vi.setSystemTime(date);

    const sut = DueDate.create(date);

    vi.setSystemTime(new Date("2000-01-03T08:00:00"));
    expect(sut.isExpired()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(Date);

    vi.clearAllTimers();
  });
});

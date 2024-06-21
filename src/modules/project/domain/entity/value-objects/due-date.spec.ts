import { DueDate } from "./due-date";

describe("DueDate", () => {
  it("should be able to verify if a date is expired", () => {
    const sut = DueDate.create(new Date());

    expect(sut.isExpired()).toBe(false);
    expect(sut.value).toBeInstanceOf(Date);
  });
});

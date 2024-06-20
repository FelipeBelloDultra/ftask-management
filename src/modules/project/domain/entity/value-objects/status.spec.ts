import { Status, StatusValues } from "./status";

describe("Status", () => {
  it("should be able to create a status with default value", () => {
    const sut = Status.create();

    expect(sut.value).toBe(StatusValues.Active);
  });

  it("should be able to update the status value", () => {
    const sut = Status.create();

    sut.setArchived();
    expect(sut.value).toBe(StatusValues.Archived);

    sut.setDeleted();
    expect(sut.value).toBe(StatusValues.Deleted);

    sut.setActive();
    expect(sut.value).toBe(StatusValues.Active);
  });

  it("should be able to verify if can activate and can archive", () => {
    const sut = Status.create();
    expect(sut.canActivate()).toBe(false);
    expect(sut.canArchive()).toBe(true);

    sut.setArchived();
    expect(sut.canActivate()).toBe(true);
    expect(sut.canArchive()).toBe(false);

    sut.setDeleted();
    expect(sut.canActivate()).toBe(false);
    expect(sut.canArchive()).toBe(false);
  });
});

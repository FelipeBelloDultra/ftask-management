import { makeNotification } from "@/test/factories/make-notification";

import { Notification } from "./notification";

describe("Notification", () => {
  it("should create notification instance", () => {
    const sut = makeNotification();

    expect(sut).toBeInstanceOf(Notification);
  });

  it("should create a read notification instance", () => {
    const sut = makeNotification({ readAt: new Date() });

    expect(sut).toBeInstanceOf(Notification);
    expect(sut.values.wasRead).toBeTruthy();
    expect(sut.values.readAt).toBeInstanceOf(Date);
  });

  it("should read a notification", () => {
    const sut = makeNotification();

    sut.read();
    expect(sut.values.wasRead).toBeTruthy();
    expect(sut.values.readAt).toBeInstanceOf(Date);
  });
});

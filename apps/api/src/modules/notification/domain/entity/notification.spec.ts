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
    expect(sut.wasRead).toBeTruthy();
    expect(sut.readAt).toBeInstanceOf(Date);
    expect(sut.content).toBeDefined();
    expect(sut.title).toBeDefined();
    expect(sut.createdAt).toBeDefined();
    expect(sut.recipientId).toBeDefined();
  });

  it("should read a notification", () => {
    const sut = makeNotification();

    sut.read();
    expect(sut.wasRead).toBeTruthy();
    expect(sut.readAt).toBeInstanceOf(Date);
  });
});

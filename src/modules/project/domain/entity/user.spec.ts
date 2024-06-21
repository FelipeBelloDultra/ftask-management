import { makeUser } from "test/factories/make-user";

import { User } from "./user";

describe("User", () => {
  it("should create a user instance", () => {
    const sut = makeUser();

    expect(sut).toBeInstanceOf(User);
  });
});

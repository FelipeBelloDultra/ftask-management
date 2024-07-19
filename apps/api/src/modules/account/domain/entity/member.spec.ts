import { makeMember } from "~/test/factories/make-member";

import { Member } from "./member";

describe("Member", () => {
  it("should create a member instance", () => {
    const sut = makeMember();

    expect(sut).toBeInstanceOf(Member);
  });
});

import { makeOwner } from "~/test/factories/make-owner";

import { Owner } from "./owner";

describe("Owner", () => {
  it("should create a owner instance", () => {
    const sut = makeOwner();

    expect(sut).toBeInstanceOf(Owner);
  });
});

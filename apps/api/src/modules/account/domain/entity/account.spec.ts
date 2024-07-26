import { makeAccount } from "@/test/factories/make-account";

import { Account } from "./account";

describe("Account", () => {
  it("should create a account instance", () => {
    const sut = makeAccount();

    expect(sut).toBeInstanceOf(Account);
  });
});

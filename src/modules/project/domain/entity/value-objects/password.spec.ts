import { hash } from "bcryptjs";

import { Password } from "./password";

describe("Password", () => {
  it("should create a plain password", async () => {
    const PASSWORD = "password";

    const sut = Password.create(PASSWORD);

    await expect(sut.getHashed()).resolves.not.toEqual(PASSWORD);
  });

  it("should create a hashed password", async () => {
    const PASSWORD = "password";
    const hashedPassword = await hash(PASSWORD, 8);

    const sut = Password.create(hashedPassword, true);

    await expect(sut.getHashed()).resolves.toEqual(hashedPassword);
  });

  it("should compare a plain password", async () => {
    const PASSWORD = "password";

    const sut = Password.create(PASSWORD);

    await expect(sut.comparePassword(PASSWORD)).resolves.toBeTruthy();
  });

  it("should compare a hashed password", async () => {
    const PASSWORD = "password";
    const hashedPassword = await hash(PASSWORD, 8);

    const sut = Password.create(hashedPassword, true);

    await expect(sut.comparePassword(PASSWORD)).resolves.toBeTruthy();
  });
});

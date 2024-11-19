import { IconUrl } from "./icon-url";

describe("IconUrl", () => {
  it("should be able to get fullUrl", () => {
    const sut = IconUrl.create("profile.png");

    expect(sut.getFullUrl().endsWith(sut.value)).toBeTruthy();
  });
});

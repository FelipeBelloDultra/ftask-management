import { PictureUrl } from "./picture-url";

describe("PictureUrl", () => {
  it("should be able to get fullUrl", () => {
    const sut = PictureUrl.create("profile.png");

    expect(sut.getFullUrl().endsWith(sut.value)).toBeTruthy();
  });
});

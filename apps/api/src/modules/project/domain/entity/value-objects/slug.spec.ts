import { Slug } from "./slug";

describe("Slug", () => {
  it("should be able to create a new slug from text", () => {
    const sut = Slug.createFromText("Example question title");

    expect(sut.value).toBe("example-question-title");
  });
});

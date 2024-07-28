import { ValueObject } from "@/core/entity/value-object";

export class Slug extends ValueObject<string> {
  public get value() {
    return this.props;
  }

  public static create(value: string) {
    return new Slug(value);
  }

  private static makeSlug(text: string) {
    return text
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/_/g, "-")
      .replace(/--+/g, "-")
      .replace(/-$/g, "");
  }

  /**
   * Receives a string and normalize it as a slug.
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  public static createFromText(text: string) {
    const slugText = this.makeSlug(text);

    return this.create(slugText);
  }
}

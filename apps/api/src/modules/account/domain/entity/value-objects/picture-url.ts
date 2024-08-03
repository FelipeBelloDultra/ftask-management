import { Env } from "@/config/env";
import { ValueObject } from "@/core/entity/value-object";

export class PictureUrl extends ValueObject<string> {
  public get value() {
    return this.props;
  }

  public static create(value: string) {
    return new PictureUrl(value);
  }

  public getFullUrl() {
    if (Env.storageDriverIs(["aws"])) {
      return `${Env.get("AWS_ENDPOINT")}/${Env.get("AWS_BUCKET")}/${this.props}`;
    }

    return this.props;
  }
}

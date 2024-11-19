import { Env } from "@/config/env";
import { ValueObject } from "@/core/entity/value-object";

export class IconUrl extends ValueObject<string> {
  public get value() {
    return this.props;
  }

  public static create(value: string) {
    return new IconUrl(value);
  }

  public getFullUrl() {
    return Env.getFullStoragePath(this.props);
  }
}

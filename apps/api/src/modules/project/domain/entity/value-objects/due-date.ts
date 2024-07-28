import { ValueObject } from "@/core/entity/value-object";

export class DueDate extends ValueObject<Date> {
  public get value() {
    return this.props;
  }

  public isExpired() {
    const date = new Date();
    return this.props.getTime() < date.getTime();
  }

  public static create(value: Date) {
    return new DueDate(value);
  }
}

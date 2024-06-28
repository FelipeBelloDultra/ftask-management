export class DueDate {
  private _value: Date;

  public get value() {
    return this._value;
  }

  private constructor(value: Date) {
    this._value = value;
  }

  public isExpired() {
    const date = new Date();
    return this._value.getTime() < date.getTime();
  }

  public static create(value: Date) {
    return new DueDate(value);
  }
}

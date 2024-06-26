import bcrypt from "bcryptjs";

export class Password {
  private readonly PASSWORD_SALT_ROUNDS = 8;
  private _value: string;
  private isHashed: boolean;

  private constructor(value: string, isHashed: boolean) {
    this.isHashed = isHashed;
    this._value = value;
  }

  private async hash() {
    return await bcrypt.hash(this._value, this.PASSWORD_SALT_ROUNDS);
  }

  public async getHashed() {
    if (this.isHashed) {
      return this._value;
    }

    return await this.hash();
  }

  public async comparePassword(plainPassword: string) {
    if (this.isHashed) {
      return await bcrypt.compare(plainPassword, this._value);
    }

    return this._value === plainPassword;
  }

  public static create(value: string, isHashed = false) {
    return new Password(value, isHashed);
  }
}

import * as bcrypt from "bcryptjs";

import { ValueObject } from "@/core/entity/value-object";

export class Password extends ValueObject<string> {
  private readonly PASSWORD_SALT_ROUNDS = 8;
  private isHashed: boolean;

  private constructor(value: string, isHashed: boolean) {
    super(value);
    this.isHashed = isHashed;
  }

  private async hash() {
    return await bcrypt.hash(this.props, this.PASSWORD_SALT_ROUNDS);
  }

  public async getHashed() {
    if (this.isHashed) {
      return this.props;
    }

    return await this.hash();
  }

  public async comparePassword(plainPassword: string) {
    if (this.isHashed) {
      return await bcrypt.compare(plainPassword, this.props);
    }

    return this.props === plainPassword;
  }

  public static create(value: string, isHashed = false) {
    return new Password(value, isHashed);
  }
}

import { PrismaClient } from "@prisma/client";

export class PrismaConnection extends PrismaClient {
  public constructor() {
    super({
      log: ["warn", "error"],
    });
  }

  public async connect() {
    return await this.$connect();
  }

  public async disconnect() {
    return await this.$disconnect();
  }
}

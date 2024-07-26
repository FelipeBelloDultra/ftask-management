import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { LoggerProvider } from "@/application/providers/logger.provider";
import { Env } from "@/config/env";

@injectable()
export class PrismaConnection extends PrismaClient {
  public constructor(
    @inject("LoggerProvider")
    private readonly logger: LoggerProvider,
  ) {
    super({
      log: Env.isProduction() ? ["error"] : ["error", "query", "error"],
    });
  }

  public async connect() {
    await this.$connect();
    this.logger.info("[DATABASE]: connection established");
  }

  public async disconnect() {
    await this.$disconnect();
    this.logger.warn("[DATABASE]: connection closed");
  }
}

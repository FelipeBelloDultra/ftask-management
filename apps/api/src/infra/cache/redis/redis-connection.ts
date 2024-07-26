import { Redis } from "ioredis";
import { inject, injectable } from "tsyringe";

import { LoggerProvider } from "@/application/providers/logger.provider";
import { Env } from "@/config/env";

@injectable()
export class RedisConnection extends Redis {
  public constructor(
    @inject("LoggerProvider")
    private readonly logger: LoggerProvider,
  ) {
    super({
      db: Env.get("REDIS_DB"),
      host: Env.get("REDIS_HOST"),
      port: Env.get("REDIS_PORT"),
      password: Env.get("REDIS_PASSWORD"),
    });
    this.logger.info("[REDIS]: connection established");
  }

  public __disconnect() {
    this.disconnect();
    this.logger.warn("[REDIS]: connection closed");
  }
}

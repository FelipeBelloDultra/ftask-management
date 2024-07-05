import { resolve } from "node:path";

import pino from "pino";

import { LoggerProvider } from "~/application/providers/logger.provider";

export class PinoLogger implements LoggerProvider {
  private readonly PATH = resolve(__dirname, "..", "..", "..", "storage", "logs", "app.log");
  private readonly logger = pino(
    pino.transport({
      target: "pino/file",
      options: { destination: this.PATH },
    }),
  );

  public info(msg: string | object) {
    this.logger.info(msg);
  }

  public error(msg: string | object) {
    this.logger.error(msg);
  }

  public warn(msg: string | object) {
    this.logger.warn(msg);
  }

  public debug(msg: string | object) {
    this.logger.debug(msg);
  }
}

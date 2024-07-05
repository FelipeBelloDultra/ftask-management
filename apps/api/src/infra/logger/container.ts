import { container, Lifecycle } from "tsyringe";

import { LoggerProvider } from "~/application/providers/logger.provider";

import { PinoLogger } from "./pino-logger";

container.register<LoggerProvider>(
  "LoggerProvider",
  {
    useClass: PinoLogger,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

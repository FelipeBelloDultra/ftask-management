import "reflect-metadata";
import "express-async-errors";
import "../container";

import { Server } from "node:http";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { container } from "tsyringe";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

import express, { NextFunction, Request, Response } from "express";

import { LoggerProvider } from "~/application/providers/logger.provider";
import { env } from "~/config/env";

import { PrismaConnection } from "../database/prisma/prisma-connection";

import { HttpException } from "./http-exception";
import { Routes } from "./routes";

export class App {
  public readonly expressInstance = express();
  private readonly routes = new Routes();
  private readonly prismaConnection = container.resolve<PrismaConnection>("PrismaConnection");
  private readonly logger = container.resolve<LoggerProvider>("LoggerProvider");

  private async connectPrisma() {
    return await this.prismaConnection.connect();
  }

  private async disconnectPrisma() {
    return await this.prismaConnection.disconnect();
  }

  private registerRoutes() {
    this.expressInstance.use("/api", this.routes.router);
  }

  private setGlobalErrorHandler() {
    this.expressInstance.use((err: Error, request: Request, response: Response, _: NextFunction) => {
      if (err instanceof ZodError) {
        return response.status(400).json({
          status_code: 400,
          message: "Validation failed",
          errors: fromZodError(err).details,
        });
      }

      if (err instanceof HttpException) {
        return response.status(err.statusCode).json({
          status_code: err.statusCode,
          message: err.message,
          errors: err.errors,
        });
      }

      this.logger.error(err);

      return response.status(500).json({
        status_code: 500,
        message: "Internal server error",
        errors: [],
      });
    });
  }

  private registerMiddlewares() {
    this.expressInstance.use(express.json());
    this.expressInstance.use(cors());
    this.expressInstance.use(morgan("short"));
    this.expressInstance.use(helmet());
    this.registerRoutes();
    this.setGlobalErrorHandler();
  }

  public async startServices() {
    await this.connectPrisma();
    this.registerMiddlewares();
  }

  public async stopServices() {
    await this.disconnectPrisma();
  }

  public async boot() {
    try {
      await this.startServices();

      const server = this.expressInstance.listen(env.HTTP_SERVER_PORT);
      this.addGracefulShutdownHandlers(server);
    } catch (error) {
      this.logger.error(error as unknown as object);
      this.stopServices();
    }
  }

  private addGracefulShutdownHandlers(server: Server) {
    const EVENTS = ["uncaughtException", "unhandledRejection", "SIGTERM", "SIGINT"] as const;

    EVENTS.forEach((event) => {
      process.on(event, async () => {
        this.stopServices().then(() => {
          this.logger.warn("Service stopping");

          server.close(() => {
            process.exit(0);
          });
        });
      });
    });
  }
}

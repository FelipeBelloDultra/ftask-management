import "reflect-metadata";
import "express-async-errors";
import "../container";

import { Server } from "node:http";

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { MulterError } from "multer";
import { container } from "tsyringe";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

import { LoggerProvider } from "@/application/providers/logger.provider";
import { Env } from "@/config/env";

import { RedisConnection } from "../cache/redis/redis-connection";
import { PrismaConnection } from "../database/prisma/prisma-connection";
import { Events } from "../events";

import { HttpException } from "./http-exception";
import { Routes } from "./routes";

export class App {
  public readonly expressInstance = express();
  private readonly routes = new Routes();
  private readonly prismaConnection = container.resolve<PrismaConnection>("PrismaConnection");
  private readonly logger = container.resolve<LoggerProvider>("LoggerProvider");
  private readonly redisConnection = container.resolve<RedisConnection>("RedisConnection");

  private async connectPrisma() {
    return await this.prismaConnection.__connect();
  }

  private async disconnectPrisma() {
    return await this.prismaConnection.__disconnect();
  }

  private disconnectRedis() {
    this.redisConnection.__disconnect();
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

      if (err instanceof MulterError) {
        return response.status(400).json({
          status_code: 400,
          message: err.message,
          errors: [],
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
    this.expressInstance.use(helmet());
    this.expressInstance.use(morgan("short"));
    this.expressInstance.use(
      cors({
        origin: Env.get("FRONTEND_WEB_URL"),
        credentials: true,
      }),
    );
    this.expressInstance.use(cookieParser());
    this.setGlobalErrorHandler();
    this.registerRoutes();
  }

  public async startServices() {
    new Events();
    await this.connectPrisma();
    this.registerMiddlewares();
  }

  public async stopServices() {
    await this.disconnectPrisma();
    this.disconnectRedis();
  }

  public async boot() {
    try {
      await this.startServices();

      const server = this.expressInstance.listen(Env.get("HTTP_SERVER_PORT"));
      this.addGracefulShutdownHandlers(server);
    } catch (error) {
      this.logger.error(error as unknown as object);
      this.stopServices();
    }
  }

  private addGracefulShutdownHandlers(server: Server) {
    return;

    // TODO: Fix this graceful shutdown strategy
    ["uncaughtException", "unhandledRejection", "SIGTERM", "SIGINT"].forEach((event) => {
      process.on(event, async () => {
        const time = new Date().getTime();

        this.logger.error({ msg: `Received ${event}, stopping all services`, at: time });

        server.close(() => {
          this.logger.error({ msg: `Server stopped`, at: time });

          this.stopServices().then(() => {
            this.logger.error({ msg: `Services stopped`, at: time });

            process.exit(0);
          });
        });
      });
    });
  }
}

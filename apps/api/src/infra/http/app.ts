import "express-async-errors";

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { container } from "tsyringe";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

import { PrismaConnection } from "../database/prisma/prisma-connection";

import { HttpException } from "./http-exception";
import { Routes } from "./routes";

const expressInstance = express();
const routes = new Routes();
const prismaConnection = container.resolve<PrismaConnection>("PrismaConnection");

export class App {
  public readonly expressInstance = expressInstance;
  public readonly prismaConnection = prismaConnection;
  public readonly routes = routes;

  public async connectPrisma() {
    return await prismaConnection.connect();
  }

  public async disconnectPrisma() {
    return await prismaConnection.disconnect();
  }

  private registerRoutes() {
    this.expressInstance.use("/api", this.routes.router);
  }

  public setGlobalErrorHandler() {
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

      console.log(err);

      return response.status(500).json({
        status_code: 500,
        message: "Internal server error",
        errors: [],
      });
    });
  }

  public registerMiddlewares() {
    this.expressInstance.use(express.json());
    this.expressInstance.use(cors());
    this.expressInstance.use(morgan("short"));
    this.expressInstance.use(helmet());
    this.registerRoutes();
    this.setGlobalErrorHandler();
  }
}

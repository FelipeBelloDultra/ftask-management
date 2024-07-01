import express from "express";

import { PrismaConnection } from "../database/prisma/prisma-connection";

import { Routes } from "./routes";

const expressInstance = express();
const routes = new Routes();
const prismaConnection = new PrismaConnection();

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

  public registerMiddlewares() {
    this.expressInstance.use(express.json());
    this.registerRoutes();
  }
}

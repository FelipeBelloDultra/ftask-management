import "dotenv/config";
import "./container";

import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";

import { Env } from "@/config/env";

class DatabaseSetupTesting {
  public static SCHEMA_NAME_ID = randomUUID();

  public static DB_CONNECTION = new PrismaClient({
    datasourceUrl: this.setDatabaseURL(),
  });
  public static REDIS_CONNECTION = new Redis({
    db: this.setRedisDatabase(),
    host: Env.get("REDIS_HOST"),
    port: Env.get("REDIS_PORT"),
    password: Env.get("REDIS_PASSWORD"),
  });

  public static generateDatabaseURL() {
    if (!process.env.DATABASE_URL) {
      throw new Error("Please provide a DATABASE_URL environment variable.");
    }

    const url = new URL(process.env.DATABASE_URL);

    url.searchParams.set("schema", this.SCHEMA_NAME_ID);

    return url.toString();
  }

  public static setRedisDatabase() {
    return 2;
  }

  public static setDatabaseURL() {
    process.env.DATABASE_URL = this.generateDatabaseURL();

    return process.env.DATABASE_URL;
  }
}

beforeAll(async () => {
  await DatabaseSetupTesting.REDIS_CONNECTION.flushdb();

  execSync("npm run db:migrate:deploy");
});

afterAll(async () => {
  await DatabaseSetupTesting.DB_CONNECTION.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${DatabaseSetupTesting.SCHEMA_NAME_ID}" CASCADE`,
  );

  await DatabaseSetupTesting.DB_CONNECTION.$disconnect();
});

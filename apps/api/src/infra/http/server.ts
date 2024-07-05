import "reflect-metadata";
import "dotenv/config";

import "../container";

import { env } from "~/config/env";

import { App } from "./app";

new App().boot(env.HTTP_SERVER_PORT);

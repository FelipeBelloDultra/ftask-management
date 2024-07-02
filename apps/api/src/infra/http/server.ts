import "reflect-metadata";
import "dotenv/config";

import "../container";

import { env } from "~/config/env";

import { App } from "./app";

const app = new App();

class Server {
  public async startServices() {
    await app.connectPrisma();
    app.registerMiddlewares();
  }

  public async stopServices() {
    await app.disconnectPrisma();
  }

  public async boot() {
    await this.startServices();

    const server = app.expressInstance.listen(env.HTTP_SERVER_PORT);

    process.on("SIGTERM", async () => {
      await this.stopServices();

      server.close();
    });
  }
}

const server = new Server();

server.boot().catch(() => {
  server.stopServices();
});

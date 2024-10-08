import supertest from "supertest";
import { container } from "tsyringe";

import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { App } from "@/infra/http/app";
import { Password } from "@/modules/account/domain/entity/value-objects/password";
import { makeAccount } from "@/test/factories/make-account";

describe("[E2E] - Create account - [POST /account]", () => {
  let app: App;
  let prismaConnection: PrismaConnection;

  beforeAll(async () => {
    app = new App();
    prismaConnection = container.resolve(PrismaConnection);
    await app.startServices();
  });

  it("should create account", async () => {
    const PASSWORD = "test-password";
    const account = makeAccount({
      password: Password.create(PASSWORD),
    });

    const sut = await supertest(app.expressInstance).post("/api/account").send({
      name: account.name,
      email: account.email,
      password: PASSWORD,
    });

    expect(sut.status).toBe(201);
    expect(await prismaConnection.account.count()).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

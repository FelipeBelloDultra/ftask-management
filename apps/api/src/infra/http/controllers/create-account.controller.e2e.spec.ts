import supertest from "supertest";
import { makeAccount } from "test/factories/make-account";
import { container } from "tsyringe";

import { PrismaConnection } from "~/infra/database/prisma/prisma-connection";
import { Password } from "~/modules/account/domain/entity/value-objects/password";

import { App } from "../app";

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
      name: account.values.name,
      email: account.values.email,
      password: PASSWORD,
    });

    expect(sut.status).toBe(201);
    expect(await prismaConnection.account.count()).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

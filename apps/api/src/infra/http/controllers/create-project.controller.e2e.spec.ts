import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "~/application/providers/jwt.provider";
import { PrismaConnection } from "~/infra/database/prisma/prisma-connection";
import { AccountFactory } from "~/test/factories/make-account";
import { makeProject } from "~/test/factories/make-project";

import { App } from "../app";

describe("[E2E] - Add project - [POST /projects]", () => {
  let app: App;
  let accountFactory: AccountFactory;
  let jwtProvider: JwtProvider;
  let prismaConnection: PrismaConnection;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    jwtProvider = container.resolve("JwtProvider");
    prismaConnection = container.resolve(PrismaConnection);
    await app.startServices();
  });

  it("should create project", async () => {
    const project = makeProject();
    const ownerAccount = await accountFactory.makePrismaAccount();
    const accessToken = await jwtProvider.encrypt({
      sub: ownerAccount.id.toValue(),
    });

    const sut = await supertest(app.expressInstance)
      .post("/api/projects")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: project.values.name,
      });

    expect(sut.status).toBe(201);
    expect(await prismaConnection.project.count()).toBe(1);
    expect(sut.body).toEqual({
      data: expect.objectContaining({
        id: expect.any(String),
        owner_id: ownerAccount.id.toValue(),
        name: project.values.name,
      }),
    });
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

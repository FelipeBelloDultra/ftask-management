import supertest from "supertest";
import { container } from "tsyringe";

import { App } from "@/infra/http/app";
import { Password } from "@/modules/account/domain/entity/value-objects/password";
import { AccountFactory } from "@/test/factories/make-account";

describe("[E2E] - Authenticate account - [POST /account/session]", () => {
  let app: App;
  let accountFactory: AccountFactory;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    await app.startServices();
  });

  it("should return the access and refresh token", async () => {
    const PASSWORD = "test-password";
    const prismaAccount = await accountFactory.makePrismaAccount({
      password: Password.create(PASSWORD),
    });

    const sut = await supertest(app.expressInstance).post("/api/account/session").send({
      email: prismaAccount.values.email,
      password: PASSWORD,
    });

    expect(sut.status).toBe(200);
    expect(sut.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          token: expect.any(String),
        }),
      }),
    );
    expect(sut.headers["set-cookie"]).toEqual([expect.stringContaining("refresh_token")]);
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

import supertest from "supertest";
import { container } from "tsyringe";

import { App } from "@/infra/http/app";
import { Password } from "@/modules/account/domain/entity/value-objects/password";
import { AccountFactory } from "@/test/factories/make-account";

describe("[E2E] - Refresh token - [PATCH /account/session/refresh-token]", () => {
  let app: App;
  let accountFactory: AccountFactory;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    await app.startServices();
  });

  it("should refresh token", async () => {
    const PASSWORD = "test-password";
    const account = await accountFactory.makePrismaAccount({
      password: Password.create(PASSWORD),
    });

    const authResponse = await supertest(app.expressInstance).post("/api/account/session").send({
      email: account.email,
      password: PASSWORD,
    });
    const cookies = authResponse.get("Set-Cookie") as Array<string>;

    const sut = await supertest(app.expressInstance).patch("/api/account/session/refresh-token").set("Cookie", cookies);

    expect(sut.status).toEqual(200);
    expect(sut.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          token: expect.any(String),
        }),
      }),
    );
    expect(sut.get("Set-Cookie")).toEqual([expect.stringContaining("refresh_token=")]);
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

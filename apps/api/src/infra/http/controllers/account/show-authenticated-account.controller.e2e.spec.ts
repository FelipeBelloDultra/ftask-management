import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { App } from "@/infra/http/app";
import { AccountFactory } from "@/test/factories/make-account";

describe("[E2E] - Show authenticated account - [GET /account/session/me]", () => {
  let app: App;
  let accountFactory: AccountFactory;
  let jwtProvider: JwtProvider;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    jwtProvider = container.resolve("JwtProvider");
    await app.startServices();
  });

  it("should show authenticated account", async () => {
    const account = await accountFactory.makePrismaAccount();
    const accessToken = await jwtProvider.encrypt({
      sub: account.id.toValue(),
    });

    const sut = await supertest(app.expressInstance)
      .get("/api/account/session/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(sut.status).toBe(200);
    expect(sut.body).toEqual({
      data: expect.objectContaining({
        id: account.id.toValue(),
        email: account.values.email,
        name: account.values.name,
      }),
    });
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

import { resolve } from "node:path";

import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { App } from "@/infra/http/app";
import { AccountFactory } from "@/test/factories/make-account";

describe("[E2E] - Upload account picture - [PATCH /account/upload/picture]", () => {
  let app: App;
  let accountFactory: AccountFactory;
  let jwtProvider: JwtProvider;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    jwtProvider = container.resolve("JwtProvider");
    await app.startServices();
  });

  it("upload account picture", async () => {
    const account = await accountFactory.makePrismaAccount();
    const accessToken = await jwtProvider.encrypt({
      sub: account.id.toValue(),
    });

    const sut = await supertest(app.expressInstance)
      .patch("/api/account/upload/picture")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("picture", resolve(__dirname, "..", "..", "..", "..", "..", "test", "e2e", "sample-upload.png"));

    expect(sut.status).toBe(200);
    expect(sut.body).toEqual({
      data: expect.objectContaining({
        id: account.id.toValue(),
        email: account.email,
        name: account.name,
        picture_url: expect.any(String),
      }),
    });
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

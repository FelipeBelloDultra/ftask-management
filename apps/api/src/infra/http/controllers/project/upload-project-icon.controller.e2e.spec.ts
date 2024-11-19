import { resolve } from "node:path";

import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { App } from "@/infra/http/app";
import { AccountFactory } from "@/test/factories/make-account";
import { ProjectFactory } from "@/test/factories/make-project";

describe("[E2E] - Upload project icon - [PATCH /projects/:projectId/upload/icon]", () => {
  let app: App;
  let accountFactory: AccountFactory;
  let projectFactory: ProjectFactory;
  let jwtProvider: JwtProvider;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    projectFactory = container.resolve(ProjectFactory);
    jwtProvider = container.resolve("JwtProvider");
    await app.startServices();
  });

  it("upload project icon", async () => {
    const account = await accountFactory.makePrismaAccount();
    const project = await projectFactory.makePrismaProject({
      ownerId: account.id,
    });
    const accessToken = await jwtProvider.encrypt({
      sub: account.id.toValue(),
    });

    const sut = await supertest(app.expressInstance)
      .patch(`/api/projects/${project.id.toValue()}/upload/icon`)
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("icon", resolve(__dirname, "..", "..", "..", "..", "..", "test", "e2e", "sample-upload.png"));

    expect(sut.status).toBe(200);
    expect(sut.body).toEqual({
      data: expect.objectContaining({
        id: project.id.toValue(),
        icon_url: expect.any(String),
      }),
    });
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

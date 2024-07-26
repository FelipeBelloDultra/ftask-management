import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { App } from "@/infra/http/app";
import { AccountFactory } from "@/test/factories/make-account";
import { ProjectFactory } from "@/test/factories/make-project";

describe("[E2E] - Add project member - [POST /projects/:projectId/member]", () => {
  let app: App;
  let projectFactory: ProjectFactory;
  let accountFactory: AccountFactory;
  let jwtProvider: JwtProvider;
  let prismaConnection: PrismaConnection;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    projectFactory = container.resolve(ProjectFactory);
    jwtProvider = container.resolve("JwtProvider");
    prismaConnection = container.resolve(PrismaConnection);
    await app.startServices();
  });

  it("should create project member", async () => {
    const [memberAccount, ownerAccount] = await Promise.all([
      accountFactory.makePrismaAccount(),
      accountFactory.makePrismaAccount(),
    ]);
    const [project, accessToken] = await Promise.all([
      projectFactory.makePrismaProject({
        ownerId: ownerAccount.id,
      }),
      jwtProvider.encrypt({
        sub: ownerAccount.id.toValue(),
      }),
    ]);

    const sut = await supertest(app.expressInstance)
      .post(`/api/projects/${project.id.toValue()}/member`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        member_email: memberAccount.values.email,
      });

    expect(sut.status).toBe(201);
    expect(await prismaConnection.projectHasMember.count()).toBe(1);
    expect(sut.body).toEqual({
      data: expect.objectContaining({
        project_id: project.id.toValue(),
        member_id: expect.any(String),
      }),
    });
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { App } from "@/infra/http/app";
import { AccountFactory } from "@/test/factories/make-account";
import { ProjectFactory } from "@/test/factories/make-project";

describe("[E2E] - List projects by ownerId - [GET /projects]", () => {
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

  it("should list projects by ownerId", async () => {
    const account = await accountFactory.makePrismaAccount();

    const PROJECTS_LENGTH = 21;
    const PAGE = 2;
    const LIMIT = 15;
    const projects = Array.from({ length: PROJECTS_LENGTH }, () =>
      projectFactory.makePrismaProject({
        ownerId: account.id,
      }),
    );

    await Promise.all(projects);
    const accessToken = await jwtProvider.encrypt({
      sub: account.id.toValue(),
    });

    const sut = await supertest(app.expressInstance)
      .get(`/api/projects?page=${PAGE}&limit=${LIMIT}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(sut.status).toBe(200);
    expect(sut.body.data).toEqual(
      expect.objectContaining({
        projects: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            owner_id: account.id.toValue(),
          }),
        ]),
        pagination: {
          total: {
            records: PROJECTS_LENGTH,
            per_current_page: PROJECTS_LENGTH - LIMIT,
            pages: Math.ceil(PROJECTS_LENGTH / LIMIT),
          },
          page: {
            next: null,
            current: PAGE,
            prev: PAGE - 1,
          },
          limit: LIMIT,
        },
      }),
    );
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

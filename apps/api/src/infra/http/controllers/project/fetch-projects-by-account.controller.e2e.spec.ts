import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { App } from "@/infra/http/app";
import { DueDate } from "@/modules/project/domain/entity/value-objects/due-date";
import { ParticipantRole } from "@/modules/project/domain/entity/value-objects/participant-role";
import { AccountFactory } from "@/test/factories/make-account";
import { ParticipantFactory } from "@/test/factories/make-participant";
import { makeProject, ProjectFactory } from "@/test/factories/make-project";

describe("[E2E] - List projects by ownerId - [GET /projects]", () => {
  let app: App;
  let accountFactory: AccountFactory;
  let projectFactory: ProjectFactory;
  let participantFactory: ParticipantFactory;
  let jwtProvider: JwtProvider;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    projectFactory = container.resolve(ProjectFactory);
    participantFactory = container.resolve(ParticipantFactory);
    jwtProvider = container.resolve("JwtProvider");
    await app.startServices();
  });

  it("should list projects by ownerId", async () => {
    const account = await accountFactory.makePrismaAccount();

    const PROJECTS_LENGTH = 21;
    const PAGE = 2;
    const LIMIT = 15;
    const projects = Array.from({ length: PROJECTS_LENGTH }, () => {
      return makeProject({
        ownerId: account.id,
        dueDate: DueDate.create(new Date()),
      });
    });

    const prismaProjects = projects.map((project) =>
      projectFactory.makePrismaProject(
        {
          ownerId: project.ownerId,
        },
        project.id,
      ),
    );
    await Promise.all(prismaProjects);

    const prismaParticipants = projects.map((project) =>
      participantFactory.makePrismaParticipant({
        accountId: account.id,
        projectId: project.id,
        role: ParticipantRole.createAsOwner(),
      }),
    );
    await Promise.all(prismaParticipants);

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
            is_owner: true,
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

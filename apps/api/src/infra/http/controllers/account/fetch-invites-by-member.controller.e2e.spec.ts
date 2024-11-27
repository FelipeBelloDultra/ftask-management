import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { App } from "@/infra/http/app";
import { DueDate } from "@/modules/project/domain/entity/value-objects/due-date";
import { ParticipantRole } from "@/modules/project/domain/entity/value-objects/participant-role";
import { AccountFactory } from "@/test/factories/make-account";
import { InviteFactory } from "@/test/factories/make-invite";
import { ParticipantFactory } from "@/test/factories/make-participant";
import { makeProject, ProjectFactory } from "@/test/factories/make-project";

describe("[E2E] - List projects by ownerId - [GET /account/invites]", () => {
  let app: App;
  let accountFactory: AccountFactory;
  let projectFactory: ProjectFactory;
  let participantFactory: ParticipantFactory;
  let inviteFactory: InviteFactory;
  let jwtProvider: JwtProvider;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    projectFactory = container.resolve(ProjectFactory);
    participantFactory = container.resolve(ParticipantFactory);
    inviteFactory = container.resolve(InviteFactory);
    jwtProvider = container.resolve("JwtProvider");
    await app.startServices();
  });

  it("should list invites by memberId", async () => {
    const accountOwner = await accountFactory.makePrismaAccount();
    const accountMember = await accountFactory.makePrismaAccount();

    const INVITES_LENGTH = 21;
    const PAGE = 2;
    const LIMIT = 15;
    const projects = Array.from({ length: INVITES_LENGTH }, () => {
      return makeProject({
        ownerId: accountOwner.id,
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

    const prismaInvites = projects.map((project) =>
      inviteFactory.makePrismaInvite({
        memberId: accountMember.id,
        projectId: project.id,
      }),
    );
    await Promise.all(prismaInvites);

    const prismaParticipants = projects.map((project) =>
      participantFactory.makePrismaParticipant({
        accountId: accountOwner.id,
        projectId: project.id,
        role: ParticipantRole.createAsOwner(),
      }),
    );
    await Promise.all(prismaParticipants);

    const accessToken = await jwtProvider.encrypt({
      sub: accountMember.id.toValue(),
    });

    const sut = await supertest(app.expressInstance)
      .get(`/api/account/invites?page=${PAGE}&limit=${LIMIT}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(sut.status).toBe(200);
    expect(sut.body.data).toEqual(
      expect.objectContaining({
        invites: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            member_id: accountMember.id.toValue(),
          }),
        ]),
        pagination: {
          total: {
            records: INVITES_LENGTH,
            per_current_page: INVITES_LENGTH - LIMIT,
            pages: Math.ceil(INVITES_LENGTH / LIMIT),
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

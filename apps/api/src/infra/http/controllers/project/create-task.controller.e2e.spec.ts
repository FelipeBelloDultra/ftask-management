import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { App } from "@/infra/http/app";
import { DueDate } from "@/modules/project/domain/entity/value-objects/due-date";
import {
  InvitationStatus,
  InvitationStatusValues,
} from "@/modules/project/domain/entity/value-objects/invitation-status";
import { ParticipantRole } from "@/modules/project/domain/entity/value-objects/participant-role";
import { AccountFactory } from "@/test/factories/make-account";
import { InviteFactory } from "@/test/factories/make-invite";
import { ParticipantFactory } from "@/test/factories/make-participant";
import { ProjectFactory } from "@/test/factories/make-project";
import { makeTask } from "@/test/factories/make-task";

describe("[E2E] - Add task - [POST /projects/:projectId/tasks]", () => {
  let app: App;
  let accountFactory: AccountFactory;
  let participantFactory: ParticipantFactory;
  let projectFactory: ProjectFactory;
  let inviteFactory: InviteFactory;
  let jwtProvider: JwtProvider;
  let prismaConnection: PrismaConnection;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    participantFactory = container.resolve(ParticipantFactory);
    projectFactory = container.resolve(ProjectFactory);
    inviteFactory = container.resolve(InviteFactory);
    jwtProvider = container.resolve("JwtProvider");
    prismaConnection = container.resolve(PrismaConnection);
    await app.startServices();
  });

  it("should create task", async () => {
    const date = new Date();
    const dueDate = new Date(date.setMonth(date.getMonth() + 1));

    const task = makeTask({ dueDate: DueDate.create(dueDate) });
    const [ownerAccount, memberAccount] = await Promise.all([
      accountFactory.makePrismaAccount(),
      accountFactory.makePrismaAccount(),
    ]);
    const project = await projectFactory.makePrismaProject({
      ownerId: ownerAccount.id,
    });

    await Promise.all([
      participantFactory.makePrismaParticipant({
        projectId: project.id,
        accountId: ownerAccount.id,
        role: ParticipantRole.createAsOwner(),
      }),
      participantFactory.makePrismaParticipant({
        projectId: project.id,
        accountId: memberAccount.id,
      }),
      inviteFactory.makePrismaInvite({
        memberId: memberAccount.id,
        projectId: project.id,
        status: InvitationStatus.create(InvitationStatusValues.Accepted),
      }),
    ]);

    const accessToken = await jwtProvider.encrypt({
      sub: ownerAccount.id.toValue(),
    });

    const sut = await supertest(app.expressInstance)
      .post(`/api/projects/${project.id.toValue()}/tasks`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: task.title,
        description: task.description,
        assignee_id: memberAccount.id.toValue(),
        due_date: task.dueDate.value,
      });

    expect(sut.status).toBe(201);
    expect(await prismaConnection.task.count()).toBe(1);
    expect(sut.body).toEqual({
      data: expect.objectContaining({
        id: expect.any(String),
        project_id: project.id.toValue(),
        assignee_id: memberAccount.id.toValue(),
        slug: task.slug.value,
        title: task.title,
        due_date: task.dueDate.value.toISOString(),
      }),
    });
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

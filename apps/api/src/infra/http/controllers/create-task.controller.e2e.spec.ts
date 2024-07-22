import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "~/application/providers/jwt.provider";
import { PrismaConnection } from "~/infra/database/prisma/prisma-connection";
import { DueDate } from "~/modules/project/domain/entity/value-objects/due-date";
import { AccountFactory } from "~/test/factories/make-account";
import { MemberFactory } from "~/test/factories/make-member";
import { ProjectFactory } from "~/test/factories/make-project";
import { ProjectMemberFactory } from "~/test/factories/make-project-member";
import { makeTask } from "~/test/factories/make-task";

import { App } from "../app";

describe("[E2E] - Add task - [POST /projects/:projectId/task]", () => {
  let app: App;
  let accountFactory: AccountFactory;
  let memberFactory: MemberFactory;
  let projectFactory: ProjectFactory;
  let projectMemberFactory: ProjectMemberFactory;
  let jwtProvider: JwtProvider;
  let prismaConnection: PrismaConnection;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    memberFactory = container.resolve(MemberFactory);
    projectFactory = container.resolve(ProjectFactory);
    projectMemberFactory = container.resolve(ProjectMemberFactory);
    jwtProvider = container.resolve("JwtProvider");
    prismaConnection = container.resolve(PrismaConnection);
    await app.startServices();
  });

  it("should create task", async () => {
    const date = new Date();
    const dueDate = new Date(date.setMonth(date.getMonth() + 1));

    const task = makeTask({ dueDate: DueDate.create(dueDate) });
    const ownerAccount = await accountFactory.makePrismaAccount();
    const memberAccount = await accountFactory.makePrismaAccount();
    const project = await projectFactory.makePrismaProject({
      ownerId: ownerAccount.id,
    });
    const member = await memberFactory.makePrismaMember({
      accountId: memberAccount.id,
    });
    await projectMemberFactory.makePrismaProjectMember({
      memberId: member.id,
      projectId: project.id,
    });

    const accessToken = await jwtProvider.encrypt({
      sub: ownerAccount.id.toValue(),
    });

    const sut = await supertest(app.expressInstance)
      .post(`/api/projects/${project.id.toValue()}/task`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: task.values.title,
        description: task.values.description,
        assignee_id: member.id.toValue(),
        due_date: task.values.dueDate.value,
      });

    expect(sut.status).toBe(201);
    expect(await prismaConnection.task.count()).toBe(1);
    expect(sut.body).toEqual({
      data: expect.objectContaining({
        id: expect.any(String),
        project_id: project.id.toValue(),
        assignee_id: member.id.toValue(),
        slug: task.values.slug.value,
        title: task.values.title,
        due_date: task.values.dueDate.value.toISOString(),
      }),
    });
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

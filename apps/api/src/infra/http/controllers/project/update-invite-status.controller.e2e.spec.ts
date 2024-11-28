import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { App } from "@/infra/http/app";
import { AccountFactory } from "@/test/factories/make-account";
import { InviteFactory } from "@/test/factories/make-invite";
import { ProjectFactory } from "@/test/factories/make-project";

describe("[E2E] - Update Invite Status - [PUT /projects/:projectId/invites/:inviteId/:inviteStatus]", () => {
  let app: App;
  let accountFactory: AccountFactory;
  let projectFactory: ProjectFactory;
  let inviteFactory: InviteFactory;
  let jwtProvider: JwtProvider;
  let prismaConnection: PrismaConnection;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    projectFactory = container.resolve(ProjectFactory);
    inviteFactory = container.resolve(InviteFactory);
    jwtProvider = container.resolve("JwtProvider");
    prismaConnection = container.resolve(PrismaConnection);
    await app.startServices();
  });

  it("should update invite status to Accepted", async () => {
    const [account, ownerAccount] = await Promise.all([
      accountFactory.makePrismaAccount(),
      accountFactory.makePrismaAccount(),
    ]);
    const project = await projectFactory.makePrismaProject({
      ownerId: ownerAccount.id,
    });

    const [invite, accessToken] = await Promise.all([
      inviteFactory.makePrismaInvite({
        projectId: project.id,
        memberId: account.id,
      }),
      jwtProvider.encrypt({
        sub: account.id.toValue(),
      }),
    ]);

    const sut = await supertest(app.expressInstance)
      .patch(`/api/projects/${project.id.toValue()}/invites/${invite.id.toValue()}/accept`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(sut.status).toBe(204);

    const updatedInvite = await prismaConnection.projectInvites.findUniqueOrThrow({
      where: { id: invite.id.toValue() },
    });

    expect(updatedInvite).toBeDefined();
    expect(updatedInvite.status).toBe("accepted");
  });
});

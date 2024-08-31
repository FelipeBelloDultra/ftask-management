import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { App } from "@/infra/http/app";
import { AccountFactory } from "@/test/factories/make-account";
import { NotificationFactory } from "@/test/factories/make-notification";

describe("[E2E] - Mark notification as read - [patch /notifications/:notificationId/read]", () => {
  let app: App;
  let accountFactory: AccountFactory;
  let notificationFactory: NotificationFactory;
  let jwtProvider: JwtProvider;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    notificationFactory = container.resolve(NotificationFactory);
    jwtProvider = container.resolve("JwtProvider");
    await app.startServices();
  });

  it("Should mark notification as read", async () => {
    const account = await accountFactory.makePrismaAccount();
    const [notification, accessToken] = await Promise.all([
      notificationFactory.makePrismaNotification({
        recipientId: account.id,
      }),
      jwtProvider.encrypt({
        sub: account.id.toValue(),
      }),
    ]);

    const sut = await supertest(app.expressInstance)
      .patch(`/api/notifications/${notification.id.toValue()}/read`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(sut.status).toBe(204);
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

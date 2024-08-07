import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { App } from "@/infra/http/app";
import { AccountFactory } from "@/test/factories/make-account";
import { NotificationFactory } from "@/test/factories/make-notification";

describe("[E2E] - Count notifications by recipientId - [GET /notifications/count]", () => {
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

  it("should count notifications by recipientId", async () => {
    const account = await accountFactory.makePrismaAccount();

    const READ_NOTIFICATIONS_LENGTH = 21;
    const UNREAD_NOTIFICATIONS_LENGTH = 10;
    const FILTER_BY_READ = true;

    const readNotifications = Array.from({ length: READ_NOTIFICATIONS_LENGTH }, () =>
      notificationFactory.makePrismaNotification({
        recipientId: account.id,
        readAt: new Date(),
      }),
    );
    const unreadNotifications = Array.from({ length: UNREAD_NOTIFICATIONS_LENGTH }, () =>
      notificationFactory.makePrismaNotification({
        recipientId: account.id,
      }),
    );

    await Promise.all([...readNotifications, ...unreadNotifications]);
    const accessToken = await jwtProvider.encrypt({
      sub: account.id.toValue(),
    });

    const sut = await supertest(app.expressInstance)
      .get(`/api/notifications/count?read=${FILTER_BY_READ}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(sut.status).toBe(200);
    expect(sut.body.data).toEqual(
      expect.objectContaining({
        total: FILTER_BY_READ ? READ_NOTIFICATIONS_LENGTH : UNREAD_NOTIFICATIONS_LENGTH,
      }),
    );
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

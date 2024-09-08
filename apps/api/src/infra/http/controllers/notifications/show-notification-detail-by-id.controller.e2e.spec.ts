import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { App } from "@/infra/http/app";
import { AccountFactory } from "@/test/factories/make-account";
import { NotificationFactory } from "@/test/factories/make-notification";
import { NotificationMetadataFactory } from "@/test/factories/make-notification-metadata";

describe("[E2E] - Show notification detail by id - [get /notifications/:notificationId]", () => {
  let app: App;
  let accountFactory: AccountFactory;
  let notificationFactory: NotificationFactory;
  let notificationMetadataFactory: NotificationMetadataFactory;
  let jwtProvider: JwtProvider;

  beforeAll(async () => {
    app = new App();
    accountFactory = container.resolve(AccountFactory);
    notificationMetadataFactory = container.resolve(NotificationMetadataFactory);
    notificationFactory = container.resolve(NotificationFactory);
    jwtProvider = container.resolve("JwtProvider");
    await app.startServices();
  });

  it("Show notification detail by id", async () => {
    const account = await accountFactory.makePrismaAccount();
    const [notification, accessToken] = await Promise.all([
      notificationFactory.makePrismaNotification({
        recipientId: account.id,
      }),
      jwtProvider.encrypt({
        sub: account.id.toValue(),
      }),
    ]);
    await notificationMetadataFactory.makePrismaNotificationMetadata({
      notificationId: notification.id,
      key: "notification-key",
      value: "notification-value",
    });

    const sut = await supertest(app.expressInstance)
      .get(`/api/notifications/${notification.id.toValue()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(sut.status).toBe(200);
    expect(sut.body.data).toEqual(
      expect.objectContaining({
        id: notification.id.toValue(),
        title: notification.title,
        created_at: notification.createdAt.toISOString(),
        read_at: notification.readAt,
        content: notification.content,
        recipient_id: account.id.toValue(),
        metadata: expect.arrayContaining([
          expect.objectContaining({
            key: "notification-key",
            value: "notification-value",
          }),
        ]),
      }),
    );
  });

  afterAll(async () => {
    await app.stopServices();
  });
});

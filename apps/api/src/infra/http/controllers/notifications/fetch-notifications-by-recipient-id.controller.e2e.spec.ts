import supertest from "supertest";
import { container } from "tsyringe";

import { JwtProvider } from "@/application/providers/jwt.provider";
import { App } from "@/infra/http/app";
import { AccountFactory } from "@/test/factories/make-account";
import { NotificationFactory } from "@/test/factories/make-notification";

describe("[E2E] - List notifications by recipientId - [GET /notifications]", () => {
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

  it("should create project member", async () => {
    const account = await accountFactory.makePrismaAccount();

    const NOTIFICATIONS_LENGTH = 21;
    const PAGE = 2;
    const LIMIT = 15;
    const notifications = Array.from({ length: NOTIFICATIONS_LENGTH }, () =>
      notificationFactory.makePrismaNotification({
        recipientId: account.id,
      }),
    );

    await Promise.all(notifications);
    const accessToken = await jwtProvider.encrypt({
      sub: account.id.toValue(),
    });

    const sut = await supertest(app.expressInstance)
      .get(`/api/notifications?page=${PAGE}&limit=${LIMIT}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(sut.status).toBe(200);
    expect(sut.body.data).toEqual(
      expect.objectContaining({
        notifications: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            recipient_id: account.id.toValue(),
          }),
        ]),
        pagination: {
          total: {
            records: NOTIFICATIONS_LENGTH,
            per_current_page: NOTIFICATIONS_LENGTH - LIMIT,
            pages: Math.ceil(NOTIFICATIONS_LENGTH / LIMIT),
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

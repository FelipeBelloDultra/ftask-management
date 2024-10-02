import { Right } from "@/core/either";
import { makeAccount } from "@/test/factories/make-account";
import { makeNotification } from "@/test/factories/make-notification";
import { InMemoryNotificationMetadataRepository } from "@/test/repositories/in-memory-notification-metadata.repository";
import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification.repository";

import { CountNotificationsByRecipientIdDto } from "../dtos/count-notifications-by-recipient-id-dto";

import { CountNotificationsByRecipientIdUseCase } from "./count-notifications-by-recipient-id.use-cases";

describe("CountNotificationsByRecipientIdUseCase", () => {
  let sut: CountNotificationsByRecipientIdUseCase;
  let inMemoryNotificationRepository: InMemoryNotificationRepository;

  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository(new InMemoryNotificationMetadataRepository());
    sut = new CountNotificationsByRecipientIdUseCase(inMemoryNotificationRepository);
  });

  it("should count the number of notifications from recipient id", async () => {
    const account1 = makeAccount();
    const account2 = makeAccount();
    const notifications1 = Array.from({ length: 4 }, () =>
      makeNotification({
        recipientId: account1.id,
        readAt: new Date(),
      }),
    );
    const notifications2 = Array.from({ length: 4 }, () =>
      makeNotification({
        recipientId: account1.id,
      }),
    );
    const notifications3 = Array.from({ length: 10 }, () =>
      makeNotification({
        recipientId: account2.id,
        readAt: new Date(),
      }),
    );
    const notifications4 = Array.from({ length: 2 }, () =>
      makeNotification({
        recipientId: account2.id,
      }),
    );

    await Promise.all(
      [...notifications1, ...notifications2, ...notifications3, ...notifications4].map((n) =>
        inMemoryNotificationRepository.create(n),
      ),
    );

    const [result1, result2, result3, result4] = (await Promise.all([
      sut.execute(
        CountNotificationsByRecipientIdDto.create({
          recipientId: account1.id.toValue(),
          read: true,
        }),
      ),
      sut.execute(
        CountNotificationsByRecipientIdDto.create({
          recipientId: account1.id.toValue(),
          read: false,
        }),
      ),
      sut.execute(
        CountNotificationsByRecipientIdDto.create({
          recipientId: account2.id.toValue(),
          read: true,
        }),
      ),
      sut.execute(
        CountNotificationsByRecipientIdDto.create({
          recipientId: account2.id.toValue(),
          read: false,
        }),
      ),
    ])) as Array<Right<never, { total: number }>>;

    expect(result1.value.total).toBe(4);
    expect(result2.value.total).toBe(4);
    expect(result3.value.total).toBe(10);
    expect(result4.value.total).toBe(2);
  });
});

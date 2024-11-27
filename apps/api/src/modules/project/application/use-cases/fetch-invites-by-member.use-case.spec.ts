import { Right } from "@/core/either";
import { makeAccount } from "@/test/factories/make-account";
import { makeInvite } from "@/test/factories/make-invite";
import { InMemoryInviteRepository } from "@/test/repositories/in-memory-invite.repository";

import { Invite } from "../../domain/entity/invite";
import { FetchInvitesByMemberDto } from "../dtos/fetch-invites-by-member-dto";

import { FetchInvitesByMemberUseCase } from "./fetch-invites-by-member.use-case";

describe("FetchInvitesByMemberUseCase", () => {
  let sut: FetchInvitesByMemberUseCase;
  let inMemoryInviteRepository: InMemoryInviteRepository;

  beforeEach(() => {
    inMemoryInviteRepository = new InMemoryInviteRepository();
    sut = new FetchInvitesByMemberUseCase(inMemoryInviteRepository);
  });

  it("should fetch invites by member id", async () => {
    const INVITES_LENGTH = 21;
    const account = makeAccount();
    const invites = Array.from({ length: INVITES_LENGTH }, () =>
      makeInvite({
        memberId: account.id,
      }),
    );

    await Promise.all(invites.map((n) => inMemoryInviteRepository.create(n)));

    const result = (await sut.execute(
      FetchInvitesByMemberDto.create({
        memberId: account.id.toValue(),
        limit: 10,
        page: 1,
      }),
    )) as Right<never, { invites: Invite[]; total: number }>;

    expect(result.isRight()).toBeTruthy();
    expect(result.value.invites.length).toBe(10);
    expect(result.value.total).toBe(INVITES_LENGTH);
  });
});

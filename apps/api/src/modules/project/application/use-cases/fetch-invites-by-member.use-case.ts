import { inject, injectable } from "tsyringe";

import { Either, right } from "@/core/either";
import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

import { InviteWithProject } from "../../domain/entity/value-objects/invite-with-project";
import { FetchInvitesByMemberDto } from "../dtos/fetch-invites-by-member-dto";
import { InviteRepository } from "../repositories/invite.repository";

type OnError = never;
type OnSuccess = { invites: InviteWithProject[]; pagination: Pagination; total: number };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class FetchInvitesByMemberUseCase {
  public constructor(
    @inject("InviteRepository")
    private readonly inviteRepository: InviteRepository,
  ) {}

  public async execute(input: FetchInvitesByMemberDto): Promise<Output> {
    const memberId = UniqueEntityID.create(input.memberId);

    const pagination = Pagination.create({
      limit: input.limit,
      page: input.page,
    });
    const { invites, total } = await this.inviteRepository.fetchManyByMemberId(memberId, pagination, {
      status: input.status,
    });

    return right({
      pagination,
      invites,
      total,
    });
  }
}

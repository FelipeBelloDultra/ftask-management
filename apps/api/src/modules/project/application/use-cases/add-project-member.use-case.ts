import { AccountRepository } from "~/account/application/repositories/account.repository";
import { MemberRepository } from "~/account/application/repositories/member.repository";
import { OwnerRepository } from "~/account/application/repositories/owner.repository";
import { Member } from "~/account/domain/entity/member";
import { Either, left, right } from "~/core/either";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { ProjectRepository } from "~/project/application/repositories/project.repository";

import { AccountNotFoundError } from "./errors/account-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";
import { OwnerCannotBeAddedAsMemberError } from "./errors/owner-cannot-be-added-as-member.error";
import { ProjectMemberAlreadyExistsError } from "./errors/project-member-already-exists.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";

type Input = {
  projectId: string;
  memberAccountEmail: string;
  ownerAccountId: string;
};
type OnError =
  | AccountNotFoundError
  | NotAllowedError
  | ProjectMemberAlreadyExistsError
  | ProjectNotFoundError
  | OwnerCannotBeAddedAsMemberError;
type OnSuccess = { member: Member };
type Output = Either<OnError, OnSuccess>;

export class AddProjectMemberUseCase {
  public constructor(
    private readonly memberRepository: MemberRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly accountRepository: AccountRepository,
    private readonly ownerRepository: OwnerRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const projectId = UniqueEntityID.create(input.projectId);

    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      return left(new ProjectNotFoundError());
    }

    const owner = await this.ownerRepository.findByAccountId(UniqueEntityID.create(input.ownerAccountId));
    if (!owner) {
      return left(new AccountNotFoundError());
    }

    if (owner.values.accountEmail === input.memberAccountEmail) {
      return left(new OwnerCannotBeAddedAsMemberError());
    }

    const isProjectOwner = project.values.ownerId.equals(owner.id);
    if (!isProjectOwner) {
      return left(new NotAllowedError());
    }

    const account = await this.accountRepository.findByEmail(input.memberAccountEmail);
    if (!account) {
      return left(new AccountNotFoundError());
    }

    const memberWasRegistered = !!(await this.memberRepository.findByAccountAndProjectId(account.id, projectId));
    if (memberWasRegistered) {
      return left(new ProjectMemberAlreadyExistsError());
    }

    const member = Member.create({
      projectId: projectId,
      accountEmail: input.memberAccountEmail,
      accountId: account.id,
      accountName: account.values.name,
    });

    await this.memberRepository.create(member);

    return right({ member });
  }
}

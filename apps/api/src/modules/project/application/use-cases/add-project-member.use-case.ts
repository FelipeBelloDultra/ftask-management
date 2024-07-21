import { AccountRepository } from "~/account/application/repositories/account.repository";
import { MemberRepository } from "~/account/application/repositories/member.repository";
import { Member } from "~/account/domain/entity/member";
import { Either, left, right } from "~/core/either";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { ProjectMemberRepository } from "~/project/application/repositories/project-member.repository";
import { ProjectRepository } from "~/project/application/repositories/project.repository";
import { ProjectMember } from "~/project/domain/entity/project-member";

import { AccountNotFoundError } from "./errors/account-not-found.error";
import { MemberNotFoundError } from "./errors/member-not-found.error";
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
  | MemberNotFoundError
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
    private readonly projectMemberRepository: ProjectMemberRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const ownerAccount = await this.accountRepository.findById(UniqueEntityID.create(input.ownerAccountId));
    if (!ownerAccount) {
      return left(new AccountNotFoundError());
    }

    const projectId = UniqueEntityID.create(input.projectId);
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      return left(new ProjectNotFoundError());
    }

    if (!project.id.equals(ownerAccount.id)) {
      return left(new NotAllowedError());
    }

    const account = await this.accountRepository.findByEmail(input.memberAccountEmail);
    if (!account) {
      return left(new MemberNotFoundError());
    }

    let member: Member | null = null;
    member = await this.memberRepository.findByAccountId(account.id);

    if (member && member.id.equals(ownerAccount.id)) {
      return left(new OwnerCannotBeAddedAsMemberError());
    }

    if (!member) {
      member = Member.create({
        accountId: account.id,
      });

      await this.memberRepository.create(member);
    }

    const projectMemberAlreadyExists = await this.projectMemberRepository.findByMemberAndProjectId(
      member.id,
      project.id,
    );
    if (projectMemberAlreadyExists) {
      return left(new ProjectMemberAlreadyExistsError());
    }

    const projectMember = ProjectMember.create({
      memberId: member.id,
      projectId: project.id,
    });
    await this.projectMemberRepository.create(projectMember);

    return right({ member });
  }
}

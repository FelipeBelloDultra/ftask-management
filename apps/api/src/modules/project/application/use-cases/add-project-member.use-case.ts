import { inject, injectable } from "tsyringe";

import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { AccountRepository } from "@/modules/account/application/repositories/account.repository";
import { MemberRepository } from "@/modules/account/application/repositories/member.repository";
import { Member } from "@/modules/account/domain/entity/member";
import { ProjectMemberRepository } from "@/modules/project/application/repositories/project-member.repository";
import { ProjectRepository } from "@/modules/project/application/repositories/project.repository";
import { MemberWithProject } from "@/modules/project/domain/entity/member-with-project";

import { AddProjectMemberDto } from "../dtos/add-project-member-dto";

import { MemberNotFoundError } from "./errors/member-not-found.error";
import { NotAllowedError } from "./errors/not-allowed.error";
import { OwnerCannotBeAddedAsMemberError } from "./errors/owner-cannot-be-added-as-member.error";
import { ProjectMemberAlreadyExistsError } from "./errors/project-member-already-exists.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";

type OnError =
  | NotAllowedError
  | MemberNotFoundError
  | ProjectMemberAlreadyExistsError
  | ProjectNotFoundError
  | OwnerCannotBeAddedAsMemberError;
type OnSuccess = { memberWithProject: MemberWithProject };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class AddProjectMemberUseCase {
  public constructor(
    @inject("MemberRepository")
    private readonly memberRepository: MemberRepository,
    @inject("ProjectRepository")
    private readonly projectRepository: ProjectRepository,
    @inject("AccountRepository")
    private readonly accountRepository: AccountRepository,
    @inject("ProjectMemberRepository")
    private readonly projectMemberRepository: ProjectMemberRepository,
  ) {}

  public async execute(input: AddProjectMemberDto): Promise<Output> {
    const projectId = UniqueEntityID.create(input.projectId);
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      return left(new ProjectNotFoundError());
    }

    const ownerAccountId = UniqueEntityID.create(input.ownerAccountId);
    if (!project.ownerId.equals(ownerAccountId)) {
      return left(new NotAllowedError());
    }

    const account = await this.accountRepository.findByEmail(input.memberAccountEmail);
    if (!account) {
      return left(new MemberNotFoundError());
    }

    let member: Member | null = null;
    member = await this.memberRepository.findByAccountId(account.id);

    if (member && member.accountId.equals(ownerAccountId)) {
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

    const memberWithProject = MemberWithProject.create({
      member,
      project,
    });

    await this.projectMemberRepository.create(memberWithProject);

    return right({ memberWithProject });
  }
}

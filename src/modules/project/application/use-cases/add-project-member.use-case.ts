import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Either, right } from "~/core/either";

import { Member } from "../../domain/entity/member";
import { MemberRepository } from "../repositories/member.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { AccountRepository } from "../repositories/account.repository";

type Input = {
  projectId: string;
  accountEmail: string;
};
type Output = Either<never, { member: Member }>;

export class AddProjectMemberUseCase {
  public constructor(
    private readonly memberRepository: MemberRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const [account, project] = await Promise.all([
      this.accountRepository.findByEmail(input.accountEmail),
      this.projectRepository.findById(input.projectId),
    ]);

    if (!account) {
      throw new Error("Account not found");
    }

    if (!project) {
      throw new Error("Project not found");
    }

    const memberWasRegistered = await this.memberRepository.findByAccountEmailAndProjectId(
      account.id.toValue(),
      input.projectId,
    );
    if (memberWasRegistered) {
      throw new Error("Member already registered");
    }

    const member = Member.create({
      projectId: UniqueEntityID.create(input.projectId),
      accountEmail: input.accountEmail,
      accountId: account.id,
      accountName: account.values.name,
    });

    await this.memberRepository.create(member);

    return right({ member });
  }
}

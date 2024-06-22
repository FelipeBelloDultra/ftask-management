import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Either, right } from "~/core/either";

import { Member } from "../../domain/entity/member";
import { MemberRepository } from "../repositories/member.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { UserRepository } from "../repositories/user.repository";

type Input = {
  projectId: string;
  userEmail: string;
};
type Output = Either<never, { member: Member }>;

export class AddProjectMemberUseCase {
  public constructor(
    private readonly memberRepository: MemberRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const [user, project] = await Promise.all([
      this.userRepository.findByEmail(input.userEmail),
      this.projectRepository.findById(input.projectId),
    ]);

    if (!user) {
      throw new Error("User not found");
    }

    if (!project) {
      throw new Error("Project not found");
    }

    const memberWasRegistered = await this.memberRepository.findByUserEmailAndProjectId(
      user.id.toValue(),
      input.projectId,
    );
    if (memberWasRegistered) {
      throw new Error("Member already registered");
    }

    const member = Member.create({
      projectId: UniqueEntityID.create(input.projectId),
      userEmail: input.userEmail,
      userId: user.id,
      userName: user.values.name,
    });

    await this.memberRepository.create(member);

    return right({ member });
  }
}

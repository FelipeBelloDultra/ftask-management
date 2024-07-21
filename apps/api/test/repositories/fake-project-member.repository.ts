import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { ProjectMemberRepository } from "~/project/application/repositories/project-member.repository";
import { ProjectMember } from "~/project/domain/entity/project-member";

export class FakeProjectMemberRepository implements ProjectMemberRepository {
  public readonly projectMembers: ProjectMember[] = [];

  public async findByMemberAndProjectId(
    memberId: UniqueEntityID,
    projectId: UniqueEntityID,
  ): Promise<ProjectMember | null> {
    const projectMember = this.projectMembers.find(
      (projectMember) => projectMember.memberId.equals(memberId) && projectMember.projectId.equals(projectId),
    );

    return projectMember || null;
  }

  public async create(projectMember: ProjectMember): Promise<void> {
    this.projectMembers.push(projectMember);
  }
}

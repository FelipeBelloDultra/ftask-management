import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { DomainEvents } from "@/core/events/domain-events";
import { ProjectMemberRepository } from "@/modules/project/application/repositories/project-member.repository";
import { MemberWithProject } from "@/modules/project/domain/entity/member-with-project";

export class InMemoryProjectMemberRepository implements ProjectMemberRepository {
  public readonly memberWithProjects: MemberWithProject[] = [];

  public async findByMemberAndProjectId(
    memberId: UniqueEntityID,
    projectId: UniqueEntityID,
  ): Promise<MemberWithProject | null> {
    const memberWithProject = this.memberWithProjects.find(
      (memberWithProject) =>
        memberWithProject.member.id.equals(memberId) && memberWithProject.project.id.equals(projectId),
    );

    return memberWithProject || null;
  }

  public async create(memberWithProject: MemberWithProject): Promise<void> {
    this.memberWithProjects.push(memberWithProject);

    DomainEvents.dispatchEventsForAggregate(memberWithProject.id);
  }

  public async save(memberWithProject: MemberWithProject): Promise<void> {
    const memberWithProjectsIndex = this.memberWithProjects.findIndex((n) => n.id.equals(memberWithProject.id));

    if (memberWithProjectsIndex !== -1) {
      this.memberWithProjects[memberWithProjectsIndex] = memberWithProject;
    }
  }
}

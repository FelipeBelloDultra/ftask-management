import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ProjectMember } from "@/modules/project/domain/entity/project-member";

export interface ProjectMemberRepository {
  findByMemberAndProjectId(memberId: UniqueEntityID, projectId: UniqueEntityID): Promise<ProjectMember | null>;
  create(projectMember: ProjectMember): Promise<void>;
}

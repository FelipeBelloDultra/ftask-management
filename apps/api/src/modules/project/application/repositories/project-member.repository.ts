import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { MemberWithProject } from "@/modules/project/domain/entity/member-with-project";

export interface ProjectMemberRepository {
  findByMemberAndProjectId(memberId: UniqueEntityID, projectId: UniqueEntityID): Promise<MemberWithProject | null>;
  create(projectMember: MemberWithProject): Promise<void>;
}

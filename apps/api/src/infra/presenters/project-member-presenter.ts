import { ProjectMember } from "@/modules/project/domain/entity/project-member";

export class ProjectMemberPresenter {
  public static toHTTP(projectMember: ProjectMember) {
    return {
      member_id: projectMember.memberId.toValue(),
      project_id: projectMember.projectId.toValue(),
    };
  }
}

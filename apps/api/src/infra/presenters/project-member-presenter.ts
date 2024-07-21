import { ProjectMember } from "~/project/domain/entity/project-member";

export class ProjectMemberPresenter {
  public static toHTTP(projectMember: ProjectMember) {
    return {
      data: {
        member_id: projectMember.memberId.toString(),
        project_id: projectMember.projectId.toString(),
      },
    };
  }
}

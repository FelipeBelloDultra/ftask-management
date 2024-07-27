import { ProjectMemberDetails } from "@/modules/project/domain/entity/project-member-details";

export class ProjectMemberDetailsPresenter {
  public static toHTTP(projectMemberDetails: ProjectMemberDetails) {
    return {
      member_id: projectMemberDetails.member.id.toValue(),
      project_id: projectMemberDetails.project.id.toValue(),
    };
  }
}

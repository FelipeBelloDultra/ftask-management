import { MemberWithProject } from "@/modules/project/domain/entity/member-with-project";

export class MemberWithProjectPresenter {
  public static toHTTP(memberWithProject: MemberWithProject) {
    return {
      member_id: memberWithProject.member.id.toValue(),
      project_id: memberWithProject.project.id.toValue(),
    };
  }
}

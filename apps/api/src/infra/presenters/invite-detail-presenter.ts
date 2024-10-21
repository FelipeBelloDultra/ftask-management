import { InviteDetail } from "@/modules/project/domain/entity/value-objects/invite-detail";

export class InviteDetailPresenter {
  public static toHTTP(inviteDetail: InviteDetail) {
    return {
      id: inviteDetail.id.toValue(),
      project_id: inviteDetail.project.id.toValue(),
      member_id: inviteDetail.member.id.toValue(),
      status: inviteDetail.status.value,
    };
  }
}

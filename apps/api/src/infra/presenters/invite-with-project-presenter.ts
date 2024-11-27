import { InviteWithProject } from "@/modules/project/domain/entity/value-objects/invite-with-project";

export class InviteWithProjectPresenter {
  public static toHTTP(data: InviteWithProject) {
    return {
      id: data.invite.id.toValue(),
      expires_at: data.invite.expirationDate.value,
      member_id: data.invite.memberId.toValue(),
      status: data.invite.status.value,
      project: {
        created_at: data.project.createdAt,
        slug: data.project.slug.value,
        icon_url: data.project.iconUrl?.value || null,
        name: data.project.name,
        description: data.project?.description || null,
      },
    };
  }
}

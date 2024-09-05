import { NotificationDetail } from "@/modules/notification/domain/entity/value-objects/notification-detail";

export class NotificationDetailPresenter {
  public static toHTTP(notificationDetail: NotificationDetail) {
    return {
      id: notificationDetail.notificationId.toValue(),
      title: notificationDetail.title,
      created_at: notificationDetail.createdAt,
      read_at: notificationDetail.readAt,
      content: notificationDetail.content,
      recipient_id: notificationDetail.recipientId.toValue(),
      metadata: notificationDetail.additionalInfos.map((info) => ({
        key: info.key,
        value: info.value,
      })),
    };
  }
}

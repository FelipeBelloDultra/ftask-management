import { fetchAdapter } from "@/infra/adapter/fetch-adapter-http";

import { NOTIFICATION_DETAIL } from "./endpoints";

interface ShowNotificationDetailServiceParams {
  notificationId: string;
}

interface ShowNotificationDetailServiceResponse {
  notification: {
    id: string;
    title: string;
    createdAt: Date;
    readAt: Date | null;
    content: string;
    recipientId: string;
    metadata: Array<{
      key: string;
      value: string;
    }>;
  };
}

// TODO: Fix this domain entity
export async function showNotificationDetail({
  notificationId,
}: ShowNotificationDetailServiceParams): Promise<ShowNotificationDetailServiceResponse> {
  const url = NOTIFICATION_DETAIL.replace(":notificationId", notificationId);
  const notification = await fetchAdapter.get<{
    id: string;
    title: string;
    created_at: string;
    read_at: string | null;
    content: string;
    recipient_id: string;
    metadata: Array<{
      key: string;
      value: string;
    }>;
  }>(url);

  return {
    notification: {
      id: notification.id,
      title: notification.title,
      createdAt: new Date(notification.created_at),
      readAt: notification.read_at ? new Date(notification.read_at) : null,
      content: notification.content,
      recipientId: notification.recipient_id,
      metadata: notification.metadata,
    },
  };
}

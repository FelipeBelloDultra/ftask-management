import { fetchAdapter } from "@/infra/adapter/fetch-adapter-http";

import { ALL_NOTIFICATIONS } from "./endpoints";

interface Pagination {
  total: {
    records: number;
    per_current_page: number;
    pages: number;
  };
  page: {
    next: number | null;
    current: number;
    prev: number | null;
  };
  limit: number;
}

interface Notification {
  id: string;
  title: string;
  created_at: Date;
  read_at: Date | null;
  content: string;
  recipient_id: string;
}

interface FetchNotificationsResponse {
  notifications: Array<Notification>;
  pagination: Pagination;
}

export async function fetchAllNotifications() {
  const { notifications, pagination } = await fetchAdapter.get<FetchNotificationsResponse>(ALL_NOTIFICATIONS);

  console.log({ pagination });

  return {
    notifications: notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      createdAt: notification.created_at,
      read_at: notification.read_at,
      content: notification.content,
      recipientId: notification.recipient_id,
    })),
    pagination: {
      total: {
        records: pagination.total.records,
        perCurrentPage: pagination.total.per_current_page,
        pages: pagination.total.pages,
      },
      page: {
        next: pagination.page.next,
        current: pagination.page.current,
        prev: pagination.page.prev,
      },
      limit: pagination.limit,
    },
  };
}

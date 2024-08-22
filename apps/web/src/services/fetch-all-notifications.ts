import { fetchAdapter } from "@/infra/adapter/fetch-adapter-http";
import { NotificationMapper, PersistenceNotification } from "@/infra/mappers/notification-mapper";
import { PaginationMapper, PersistencePagination } from "@/infra/mappers/pagination-mapper";

import { ALL_NOTIFICATIONS } from "./endpoints";

interface FetchNotificationsResponse {
  notifications: Array<PersistenceNotification>;
  pagination: PersistencePagination;
}

export async function fetchAllNotifications() {
  const { notifications, pagination } = await fetchAdapter.get<FetchNotificationsResponse>(ALL_NOTIFICATIONS);

  return {
    notifications: notifications.map(NotificationMapper.toDomain),
    pagination: PaginationMapper.toDomain({
      total: {
        records: pagination.total.records,
        per_current_page: pagination.total.per_current_page,
        pages: pagination.total.pages,
      },
      page: {
        next: pagination.page.next,
        current: pagination.page.current,
        prev: pagination.page.prev,
      },
      limit: pagination.limit,
    }),
  };
}

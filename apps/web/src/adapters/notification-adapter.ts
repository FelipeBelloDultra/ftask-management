import { Notification } from "@/domain/notification";
import { Pagination } from "@/domain/pagination";
import { HttpClientAdapter } from "@/infra/adapter/fetch-adapter-http";
import { HttpMethods } from "@/infra/http";
import { NotificationMapper, PersistenceNotification } from "@/infra/mappers/notification-mapper";
import { PaginationMapper, PersistencePagination } from "@/infra/mappers/pagination-mapper";

interface CountUnreadNotificationsResponse {
  total: number;
}

interface FetchAllNotificationsRequestResponse {
  notifications: Array<PersistenceNotification>;
  pagination: PersistencePagination;
}

interface FetchAllNotifications {
  notifications: Array<Notification>;
  pagination: Pagination;
}

interface AllNotificationsParams {
  read?: boolean;
  page: number;
  limit: number;
}

export interface NotificationAdapter {
  fetchAll(params: AllNotificationsParams): Promise<FetchAllNotifications>;
  getDetailById(notificationId: string): Promise<void>;
  markAsReadById(notificationId: string): Promise<void>;
  countUnread(): Promise<CountUnreadNotificationsResponse>;
}

enum NotificationRoutes {
  CountUnread = "/notifications/count/?read=false",
  FetchAll = "/notifications",
  ReadById = "/notifications/:notificationId/read",
  GetDetailById = "/notifications/:notificationId",
}

export class NotificationHttpAdapter implements NotificationAdapter {
  public constructor(private readonly http: HttpClientAdapter) {}

  private replaceRouteParams(routeParamToReplace: string, replaceBy: string) {
    return routeParamToReplace.replace(":notificationId", replaceBy);
  }

  public async fetchAll(params: AllNotificationsParams): Promise<FetchAllNotifications> {
    const urlSearch = new URLSearchParams();

    if (params.read !== undefined && typeof params.read === "boolean") {
      urlSearch.set("read", String(params.read || false));
    }

    urlSearch.set("page", String(params.page || 1));
    urlSearch.set("limit", String(params.limit || 10));

    const { notifications, pagination } = await this.http.sendRequest<FetchAllNotificationsRequestResponse>({
      method: HttpMethods.GET,
      url: `${NotificationRoutes.FetchAll}?${urlSearch.toString()}`,
    });

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

  public async getDetailById(notificationId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async markAsReadById(notificationId: string): Promise<void> {
    const url = this.replaceRouteParams(NotificationRoutes.ReadById, notificationId);

    await this.http.sendRequest({
      method: HttpMethods.PATCH,
      url,
    });
  }

  public async countUnread(): Promise<CountUnreadNotificationsResponse> {
    const response = await this.http.sendRequest<{ total: number }>({
      method: HttpMethods.GET,
      url: NotificationRoutes.CountUnread,
    });

    return {
      total: response.total,
    };
  }
}

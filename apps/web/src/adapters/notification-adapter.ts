import { HttpClientAdapter } from "@/infra/adapter/fetch-adapter-http";
import { HttpMethods } from "@/infra/http";

interface CountUnreadNotificationsResponse {
  total: number;
}

export interface NotificationAdapter {
  fetchAll(): Promise<void>;
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

  public async fetchAll(): Promise<void> {
    throw new Error("Method not implemented.");
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

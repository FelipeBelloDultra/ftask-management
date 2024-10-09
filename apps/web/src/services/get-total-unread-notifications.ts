import { httpClientAdapter } from "@/infra/adapter/fetch-adapter-http";
import { HttpMethods } from "@/infra/http";

import { COUNT_NOTIFICATIONS } from "./endpoints";

interface GetTotalUnreadNotificationsResponse {
  total: number;
}

export async function getTotalUnreadNotificationsService() {
  const response = await httpClientAdapter.sendRequest<GetTotalUnreadNotificationsResponse>({
    method: HttpMethods.GET,
    url: `${COUNT_NOTIFICATIONS}/?read=false`,
  });

  return {
    total: response.total,
  };
}

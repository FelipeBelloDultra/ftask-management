import { fetchAdapter } from "@/infra/adapter/fetch-adapter-http";

import { COUNT_NOTIFICATIONS } from "./endpoints";

interface GetTotalUnreadNotificationsResponse {
  total: number;
}

export async function getTotalUnreadNotificationsService() {
  const response = await fetchAdapter.get<GetTotalUnreadNotificationsResponse>(`${COUNT_NOTIFICATIONS}/?read=false`);

  return {
    total: response.total,
  };
}

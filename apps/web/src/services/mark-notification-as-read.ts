import { fetchAdapter } from "@/infra/adapter/fetch-adapter-http";

import { READ_NOTIFICATION } from "./endpoints";

interface ReadNotificationServiceParams {
  notificationId: string;
}

export async function readNotificationService({ notificationId }: ReadNotificationServiceParams) {
  const url = READ_NOTIFICATION.replace(":notificationId", notificationId);

  await fetchAdapter.patch(url);
}

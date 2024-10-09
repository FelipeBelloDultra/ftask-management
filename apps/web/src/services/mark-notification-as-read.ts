import { httpClientAdapter } from "@/infra/adapter/fetch-adapter-http";
import { HttpMethods } from "@/infra/http";

import { READ_NOTIFICATION } from "./endpoints";

interface ReadNotificationServiceParams {
  notificationId: string;
}

export async function readNotificationService({ notificationId }: ReadNotificationServiceParams) {
  const url = READ_NOTIFICATION.replace(":notificationId", notificationId);

  await httpClientAdapter.sendRequest({
    method: HttpMethods.PATCH,
    url,
  });
}

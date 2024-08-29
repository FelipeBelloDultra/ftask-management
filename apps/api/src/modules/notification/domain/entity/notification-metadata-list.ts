import { WatchedList } from "@/core/entity/watched-list";

import { NotificationMetadata } from "./notification-metadata";

export class NotificationMetadataList extends WatchedList<NotificationMetadata> {
  public compareItems(a: NotificationMetadata, b: NotificationMetadata): boolean {
    return a.notificationId.equals(b.notificationId);
  }
}

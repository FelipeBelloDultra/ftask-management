import { makeNotificationMetadata } from "@/test/factories/make-notification-metadata";

import { NotificationMetadataList } from "./notification-metadata-list";

describe("NotificationMetadataList", () => {
  it("should be able to compare notifications", () => {
    const notificationMetadataList = new NotificationMetadataList();
    const metadata1 = makeNotificationMetadata();
    const metadata2 = makeNotificationMetadata();

    const sut = notificationMetadataList.compareItems(metadata1, metadata2);

    expect(sut).toBeFalsy();
  });
});

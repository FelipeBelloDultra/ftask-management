import { BellDot as BellDotIcon, Bell as BellIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

function getNotificationIcon(hasUnread = false) {
  return hasUnread ? BellDotIcon : BellIcon;
}

export function HeaderNotifications() {
  const hasUnreadNotification = true;
  const NotificationIcon = getNotificationIcon(hasUnreadNotification);

  return (
    <Button size="icon" asChild variant="outline">
      <Link href="/dash/notifications" prefetch={false}>
        <NotificationIcon size={20} />
      </Link>
    </Button>
  );
}

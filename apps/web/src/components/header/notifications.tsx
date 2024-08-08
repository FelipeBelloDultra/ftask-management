import { BellDot as BellDotIcon, Bell as BellIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

function getNotificationIcon(hasUnread = false) {
  return hasUnread ? BellDotIcon : BellIcon;
}

interface HeaderNotificationsProps {
  total: number;
}

export function HeaderNotifications({ total = 0 }: HeaderNotificationsProps) {
  const hasUnreadNotification = total > 0;
  const NotificationIcon = getNotificationIcon(hasUnreadNotification);

  return (
    <Button size="icon" asChild variant="outline">
      <Link href={`/dash/notifications?read=${!hasUnreadNotification}`} prefetch={false}>
        <NotificationIcon size={20} />
      </Link>
    </Button>
  );
}

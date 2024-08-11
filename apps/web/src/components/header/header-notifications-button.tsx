import { BellDot as BellDotIcon, Bell as BellIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

function getNotificationIcon(hasUnread = false) {
  return hasUnread ? BellDotIcon : BellIcon;
}

interface HeaderNotificationsButtonProps {
  total: number;
}

export function HeaderNotificationsButton({ total = 0 }: HeaderNotificationsButtonProps) {
  const hasUnreadNotification = total > 0;
  const NotificationIcon = getNotificationIcon(hasUnreadNotification);

  return (
    <Button size="icon" asChild variant="outline">
      <Link href="/dash/notifications?read=false" prefetch={false}>
        <NotificationIcon size={20} />
      </Link>
    </Button>
  );
}

import { Link } from "react-router-dom";

import { BellDotIcon, BellIcon } from "@/presentation/components/icons";
import { Button } from "@/presentation/components/ui/button";

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
      <Link to="/dash/notifications?read=false">
        <NotificationIcon size={20} />
      </Link>
    </Button>
  );
}

import { BellDot as BellDotIcon, Bell as BellIcon } from "lucide-react";
import Link from "next/link";

import { ProfileHeader } from "./profile-header";
import { Button } from "./ui/button";

function getNotificationIcon(hasUnread = false) {
  return hasUnread ? BellDotIcon : BellIcon;
}

export function Header() {
  const hasUnreadNotification = true;
  const NotificationIcon = getNotificationIcon(hasUnreadNotification);

  return (
    <header className="flex justify-between items-center container py-3">
      project selector
      <section className="flex gap-4 items-center">
        <Button size="icon" asChild variant="outline">
          <Link href="/dash/notifications" prefetch={false}>
            <NotificationIcon size={20} />
          </Link>
        </Button>

        <ProfileHeader />
      </section>
    </header>
  );
}

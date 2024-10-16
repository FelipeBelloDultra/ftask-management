import { Link } from "react-router-dom";

import { If } from "@/presentation/components/conditionals";
import { BellIcon } from "@/presentation/components/icons";
import { Button } from "@/presentation/components/ui/button";

interface HeaderNotificationsButtonProps {
  total: number;
}

export function HeaderNotificationsButton({ total = 0 }: HeaderNotificationsButtonProps) {
  const hasUnreadNotification = total > 0;

  return (
    <Button size="icon" asChild variant="outline" className="relative">
      <Link to="/dash/notifications?read=false">
        <BellIcon size={20} />

        <If condition={hasUnreadNotification}>
          <span className="absolute text-sm text-white font-bold bg-blue-500 -top-1 -right-2 flex justify-center items-center rounded-full size-2 p-3">
            {total}
          </span>
        </If>
      </Link>
    </Button>
  );
}

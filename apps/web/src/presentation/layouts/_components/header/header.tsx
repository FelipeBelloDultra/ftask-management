import { useSuspenseQuery } from "@tanstack/react-query";

import { ThemeToggle } from "@/presentation/components/theme-toggle";
import { useUserStore } from "@/presentation/store/user";
import { getTotalUnreadNotificationsService } from "@/services/get-total-unread-notifications";

import { NotificationsButton } from "./notifications-button";
import { ProfileDropdown } from "./profile-dropdown";

export function Header() {
  const { state } = useUserStore();
  const { data } = useSuspenseQuery({
    queryKey: ["notifications", "read:unread", "total"],
    queryFn: () => getTotalUnreadNotificationsService(),
  });

  return (
    <header className="flex justify-between items-center h-14 px-4 border-b w-full flex-shrink-0 bg-accent/50">
      <h1 className="text-2xl font-semibold tracking-wider">FTask Management</h1>

      <section className="flex gap-3 items-center">
        <ThemeToggle />

        <NotificationsButton total={data.total} />

        <ProfileDropdown
          user={{
            email: state.user.email,
            pictureUrl: state.user.pictureUrl,
            name: state.user.name,
          }}
        />
      </section>
    </header>
  );
}

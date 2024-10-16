import { useSuspenseQuery } from "@tanstack/react-query";

import { useUserStore } from "@/presentation/store/user";
import { getTotalUnreadNotificationsService } from "@/services/get-total-unread-notifications";

import { HeaderNotificationsButton } from "./header-notifications-button";
import { HeaderProfileDropdown } from "./header-profile-dropdown";
import { HeaderToggleTheme } from "./header-toggle-theme";

export function Header() {
  const { state } = useUserStore();
  const { data } = useSuspenseQuery({
    queryKey: ["notifications", "read:unread", "total"],
    queryFn: () => getTotalUnreadNotificationsService(),
  });

  return (
    <header className="flex justify-between items-center h-14 px-4 border-b w-full">
      <p>My Projects</p>

      <section className="flex gap-4 items-center">
        <HeaderToggleTheme />

        <HeaderNotificationsButton total={data.total} />

        <HeaderProfileDropdown
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

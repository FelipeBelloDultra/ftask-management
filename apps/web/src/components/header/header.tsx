import { useSuspenseQuery } from "@tanstack/react-query";

import { getTotalUnreadNotificationsService } from "@/services/get-total-unread-notifications";
import { useUserStore } from "@/store/user";

import { HeaderNavigation } from "./header-navigation";
import { HeaderNotificationsButton } from "./header-notifications-button";
import { HeaderProfileDropdown } from "./header-profile-dropdown";

export function Header() {
  const { state } = useUserStore();
  const { data } = useSuspenseQuery({
    queryKey: [`user-id-${state.user.id}:notifications:total:unread`],
    queryFn: () => getTotalUnreadNotificationsService(),
  });

  return (
    <header className="flex justify-between items-center h-20 px-4 border-b w-full">
      <HeaderNavigation />

      <section className="flex gap-4 items-center">
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

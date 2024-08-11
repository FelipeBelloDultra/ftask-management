import { useUserStore } from "@/store/user";

import { HeaderNavigation } from "./header-navigation";
import { HeaderNotificationsButton } from "./header-notifications-button";
import { HeaderProfileDropdown } from "./header-profile-dropdown";

export async function Header() {
  const user = useUserStore.getState().state.user;

  const response = await fetch("http://localhost:3333/api/notifications/count?read=false", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    cache: "no-cache",
  });
  const { data } = (await response.json()) as { data: { total: number } };

  return (
    <header className="flex justify-between items-center h-20 px-4 border-b w-full">
      <HeaderNavigation />

      <section className="flex gap-4 items-center">
        <HeaderNotificationsButton total={data.total} />

        <HeaderProfileDropdown
          user={{
            email: user.email,
            pictureUrl: user.pictureUrl,
            name: user.name,
          }}
        />
      </section>
    </header>
  );
}

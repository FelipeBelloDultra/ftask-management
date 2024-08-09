import { setTimeout } from "timers/promises";

import { useUserStore } from "@/store/user";

import { HeaderNavigation } from "./navigation";
import { HeaderNotifications } from "./notifications";
import { HeaderProfile } from "./profile";

export async function HeaderRoot() {
  await setTimeout(1500);

  const totalNotifications = 1;
  const user = useUserStore.getState().state.user;

  return (
    <header className="flex justify-between items-center h-20 px-4 border-b w-full">
      <HeaderNavigation />

      <section className="flex gap-4 items-center">
        <HeaderNotifications total={totalNotifications} />

        <HeaderProfile
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

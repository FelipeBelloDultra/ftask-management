import { setTimeout } from "timers/promises";

import { getServerSession } from "next-auth";

import { nextAuthOptions } from "@/config/next-auth";

import { HeaderNavigation } from "./navigation";
import { HeaderNotifications } from "./notifications";
import { HeaderProfile } from "./profile";

export async function HeaderRoot() {
  await setTimeout(2000);
  const session = await getServerSession(nextAuthOptions);

  return (
    <header className="flex justify-between items-center container h-20">
      <HeaderNavigation />

      <section className="flex gap-4 items-center">
        <HeaderNotifications />

        <HeaderProfile
          user={{
            email: session!.user.email,
            pictureUrl: session!.user.picture_url,
            name: session!.user.name,
          }}
        />
      </section>
    </header>
  );
}

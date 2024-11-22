import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Link } from "react-router-dom";

import { ProjectSelector } from "@/presentation/components/project-selector";
import { ThemeToggle } from "@/presentation/components/theme-toggle";
import { Button } from "@/presentation/components/ui/button";
import { useDependencies } from "@/presentation/hooks/use-dependencies";
import { useUserStore } from "@/presentation/store/user";

import { NotificationsButton } from "./notifications-button";
import { ProfileDropdown } from "./profile-dropdown";

export function Header() {
  const { notificationAdapter } = useDependencies();
  const { state } = useUserStore();
  const { data } = useSuspenseQuery({
    queryKey: ["notifications", "read:unread", "total"],
    queryFn: () => notificationAdapter.countUnread(),
  });

  return (
    <header className="flex justify-between items-center h-14 px-4 border-b w-full flex-shrink-0 bg-accent/50">
      <section className="flex items-center gap-16">
        <Button asChild variant="link" className="text-2xl font-semibold tracking-wider">
          <Link to="/dash">FTask Management</Link>
        </Button>

        <Suspense fallback={<div>loading...</div>}>
          <ProjectSelector />
        </Suspense>
      </section>

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

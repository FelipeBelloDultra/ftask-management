import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { ProjectSelector } from "@/presentation/components/project-selector";
import { ThemeToggle } from "@/presentation/components/theme-toggle";
import { Button } from "@/presentation/components/ui/button";
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
      <section className="flex items-center gap-16">
        <Button asChild variant="link" className="text-2xl font-semibold tracking-wider">
          <Link to="/dash">FTask Management</Link>
        </Button>

        <ProjectSelector />
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

import { SidebarHeader } from "./sidebar-header";
import { SidebarLogoutButton } from "./sidebar-logout-button";
import { SidebarMenu } from "./sidebar-menu";

export function Sidebar() {
  return (
    <aside className="fixed w-72 h-full left-0 bottom-0 border-r flex flex-col bg-zinc-950 flex-shrink-0">
      <SidebarHeader />

      <SidebarMenu />

      <footer className="mt-auto border-t p-4 flex-shrink-0">
        <SidebarLogoutButton />
      </footer>
    </aside>
  );
}

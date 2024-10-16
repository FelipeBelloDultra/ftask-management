import { ScrollArea } from "@/presentation/components/ui/scroll-area";

import { SidebarLogoutButton } from "./sidebar-logout-button";
import { SidebarMenu } from "./sidebar-menu";

export function Sidebar() {
  return (
    <aside className="w-72 h-full left-0 bottom-0 border-r flex flex-col bg-background flex-shrink-0">
      <ScrollArea>
        <SidebarMenu />
      </ScrollArea>

      <footer className="mt-auto border-t p-4 flex-shrink-0">
        <SidebarLogoutButton />
      </footer>
    </aside>
  );
}

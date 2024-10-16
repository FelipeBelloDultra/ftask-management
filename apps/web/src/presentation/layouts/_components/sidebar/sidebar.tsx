import { CreateNewProjectButton } from "@/presentation/components/create-new-project-button";
import { LogoutButton } from "@/presentation/components/logout-button";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";

import { Menu } from "./menu";

export function Sidebar() {
  return (
    <aside className="w-72 h-full left-0 bottom-0 border-r flex flex-col bg-background flex-shrink-0">
      <header className="border-b p-4 flex-shrink-0">
        <CreateNewProjectButton />
      </header>

      <ScrollArea>
        <Menu />
      </ScrollArea>

      <footer className="mt-auto border-t p-4 flex-shrink-0">
        <LogoutButton />
      </footer>
    </aside>
  );
}

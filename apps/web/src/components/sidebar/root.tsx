import { SidebarConfig } from "./configs";
import { SidebarHeader } from "./header";

export function SidebarRoot() {
  return (
    <aside className="fixed w-72 h-full left-0 bottom-0 border-r flex flex-col bg-zinc-950">
      <SidebarHeader />

      <main className="px-4">content...</main>

      <footer className="mt-auto border-t p-4">
        <SidebarConfig />
      </footer>
    </aside>
  );
}

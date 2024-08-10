"use client";

import { usePathname } from "next/navigation";

import { getSidebarMenuList } from "@/constants/menu-options";

import { SidebarMenuItem } from "./sidebar-menu-item";

export function SidebarMenu() {
  const pathname = usePathname();
  const menus = getSidebarMenuList(pathname);

  return (
    <nav className="flex-1 p-6">
      <ul className="flex flex-col gap-1">
        {menus.map(({ icon, label, href, submenus, isActive }) => (
          <SidebarMenuItem key={href} href={href} icon={icon} label={label} submenus={submenus} isActive={isActive} />
        ))}
      </ul>
    </nav>
  );
}

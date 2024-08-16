import { useState } from "react";
import { useLocation } from "react-router-dom";

import { getSidebarMenuList } from "@/constants/menu-options";

import { SidebarMenuCollapsible } from "./sidebar-menu-collapsible";
import { SidebarMenuItem } from "./sidebar-menu-item";

export function SidebarMenu() {
  const { pathname } = useLocation();
  const menus = getSidebarMenuList(pathname);
  const [openedSubmenuKey, setOpenedSubmenuKey] = useState<null | string>(null);

  function changeToggleOpenedSubmenuKey(key: string) {
    const submenu = menus.find((menu) => menu.key === key);

    setOpenedSubmenuKey((prev) => {
      if (prev === key || !submenu) return null;

      return submenu.key;
    });
  }

  return (
    <nav className="flex-1 p-6">
      <ul className="flex flex-col gap-1">
        {menus.map(({ key, icon, label, href, submenus, isActive }) => {
          if (submenus?.length)
            return (
              <SidebarMenuCollapsible
                key={key}
                icon={icon}
                label={label}
                submenus={submenus}
                openedMenuKey={openedSubmenuKey}
                onSubmenuCollapsibleToggled={() => changeToggleOpenedSubmenuKey(key)}
                menuKey={key}
              />
            );

          return (
            <SidebarMenuItem
              key={key}
              href={href}
              icon={icon}
              label={label}
              isActive={isActive}
              onSubmenuCollapsibleToggled={() => changeToggleOpenedSubmenuKey(key)}
            />
          );
        })}
      </ul>
    </nav>
  );
}

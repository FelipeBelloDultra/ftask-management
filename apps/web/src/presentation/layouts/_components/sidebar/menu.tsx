import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { getSidebarMenuList } from "@/constants/menu-options";

import { MenuCollapsible } from "./menu-collapsible";
import { MenuItem } from "./menu-item";

export function Menu() {
  const [openedSubmenuKey, setOpenedSubmenuKey] = useState<null | string>(null);
  const { pathname } = useLocation();
  const menus = getSidebarMenuList(pathname);

  function changeToggleOpenedSubmenuKey(key: string) {
    const submenu = menus.find((menu) => !menu.isDivider && menu.href === key);

    setOpenedSubmenuKey((prev) => {
      if (submenu?.isDivider || prev === key || !submenu) return null;

      return submenu.href;
    });
  }

  useEffect(() => {
    const hrefKey = pathname;

    setOpenedSubmenuKey((prev) => {
      if (prev === hrefKey) return hrefKey;

      return hrefKey;
    });
  }, [pathname]);

  return (
    <nav className="flex-1 p-6">
      <ul className="flex flex-col gap-1">
        {menus.map((menu) => {
          if (menu.isDivider)
            return (
              <li
                key={menu.key}
                className="relative before:right-0 before:left-0 before:h-px before:absolute before:bg-muted before:top-1/2 text-center my-4"
              >
                <span className="px-2 bg-background relative">{menu.label}</span>
              </li>
            );

          if (menu.submenus?.length) {
            return (
              <MenuCollapsible
                key={menu.href}
                icon={menu.icon}
                label={menu.label}
                submenus={menu.submenus}
                openedMenuKey={openedSubmenuKey}
                onSubmenuCollapsibleToggled={() => changeToggleOpenedSubmenuKey(menu.href)}
                menuKey={menu.href}
              />
            );
          }

          return (
            <MenuItem
              key={menu.href}
              href={menu.href}
              icon={menu.icon}
              label={menu.label}
              isActive={menu.isActive}
              onSubmenuCollapsibleToggled={() => changeToggleOpenedSubmenuKey(menu.href)}
            />
          );
        })}
      </ul>
    </nav>
  );
}

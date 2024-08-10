import {
  BellRing as BellRingIcon,
  LayoutDashboard as LayoutDashboardIcon,
  LucideIcon,
  Settings as SettingsIcon,
} from "lucide-react";

export interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
  isActive: boolean;
  submenus?: Array<{
    label: string;
    href: string;
    isSubmenuActive: boolean;
  }>;
}

export function getSidebarMenuList(pathname: string): Array<MenuItem> {
  return [
    {
      label: "Dashboard",
      icon: LayoutDashboardIcon,
      href: "/dash",
      isActive: pathname === "/dash",
    },
    {
      label: "Notifications",
      icon: BellRingIcon,
      href: "/dash/notifications",
      isActive: pathname === "/dash/notifications",
    },
    {
      label: "Settings",
      icon: SettingsIcon,
      href: "/dash/settings",
      isActive: pathname === "/dash/settings",
      submenus: [
        {
          label: "Profile",
          href: "/dash/settings/profile",
          isSubmenuActive: pathname === "/dash/settings/profile",
        },
      ],
    },
  ];
}

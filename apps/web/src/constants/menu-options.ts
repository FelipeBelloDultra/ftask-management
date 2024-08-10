import {
  BellRing as BellRingIcon,
  LayoutDashboard as LayoutDashboardIcon,
  LucideIcon,
  Settings as SettingsIcon,
} from "lucide-react";

interface SubmenuItem {
  key: string;
  label: string;
  href: string;
  isSubmenuActive: boolean;
}

interface MenuItem {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string;
  isActive: boolean;
  submenus?: Array<SubmenuItem>;
}

export function getSidebarMenuList(pathname: string): Array<MenuItem> {
  return [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboardIcon,
      href: "/dash",
      isActive: pathname === "/dash",
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: BellRingIcon,
      href: "/dash/notifications",
      isActive: pathname === "/dash/notifications",
    },
    {
      key: "settings",
      label: "Settings",
      icon: SettingsIcon,
      href: "/dash/settings",
      isActive: pathname === "/dash/settings",
      submenus: [
        {
          key: "settings_profile",
          label: "Profile",
          href: "/dash/settings/profile",
          isSubmenuActive: pathname === "/dash/settings/profile",
        },
      ],
    },
  ];
}

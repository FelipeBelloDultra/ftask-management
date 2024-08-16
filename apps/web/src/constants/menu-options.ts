import {
  BellRing as BellRingIcon,
  Building2 as Building2Icon,
  LayoutDashboard as LayoutDashboardIcon,
  LucideIcon,
  Settings as SettingsIcon,
} from "lucide-react";

interface SubmenuItem {
  label: string;
  href: string;
  isSubmenuActive: boolean;
}

interface DividerItem {
  isDivider: true;
  key: string;
  label: string;
}

interface MenuItem {
  isDivider: false;
  label: string;
  icon: LucideIcon;
  href: string;
  isActive: boolean;
  submenus?: Array<SubmenuItem>;
}

type Menu = DividerItem | MenuItem;

export function getSidebarMenuList(pathname: string): Array<Menu> {
  return [
    {
      isDivider: false,
      label: "Dashboard",
      icon: LayoutDashboardIcon,
      href: "/dash",
      isActive: pathname === "/dash",
    },
    {
      isDivider: false,
      label: "Notifications",
      icon: BellRingIcon,
      href: "/dash/notifications",
      isActive: pathname === "/dash/notifications",
    },
    {
      isDivider: false,
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
    {
      isDivider: false,
      label: "Projects",
      icon: Building2Icon,
      href: "/dash/projects",
      isActive: pathname === "/dash/projects",
      submenus: [
        {
          label: "My Projects",
          href: "/dash/projects/my",
          isSubmenuActive: pathname === "/dash/projects/my",
        },
      ],
    },
  ];
}

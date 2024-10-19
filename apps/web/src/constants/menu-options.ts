import {
  BellRingIcon,
  Building2Icon,
  LayoutDashboardIcon,
  LucideIconType,
  SettingsIcon,
  StarIcon,
} from "@/presentation/components/icons";

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
  icon: LucideIconType;
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
      label: "Favorite projects",
      icon: StarIcon,
      href: "/dash/projects-favorites",
      isActive: pathname === "/dash/projects",
      submenus: [
        {
          label: "My Projects",
          href: "/dash/projects/my",
          isSubmenuActive: pathname === "/dash/projects/my",
        },
      ],
    },
    {
      isDivider: false,
      label: "Selected projects",
      icon: Building2Icon,
      href: "/dash/projects",
      isActive: pathname === "/dash/projects",
    },
  ];
}

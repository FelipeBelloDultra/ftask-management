import {
  BellRingIcon,
  LayoutDashboardIcon,
  ListCheckIcon,
  LucideIconType,
  MailWarningIcon,
  SettingsIcon,
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
      label: "Invites",
      icon: MailWarningIcon,
      href: "/dash/invites",
      isActive: pathname === "/dash/invites",
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
      label: "My tasks",
      icon: ListCheckIcon,
      href: "/dash/my-tasks",
      isActive: pathname === "/dash/my-tasks",
    },
  ];
}

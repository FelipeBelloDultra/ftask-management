"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MenuItem } from "@/constants/menu-options";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

interface SidebarMenuItemProps extends MenuItem {}

function SidebarIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className="mr-2 text-gray-400" size={18} />;
}

export function SidebarMenuItem({ href, icon, label, submenus, isActive }: SidebarMenuItemProps) {
  const isSomeSubmenuActive = submenus?.length ? submenus.some((submenu) => submenu.isSubmenuActive) : false;

  if (!submenus?.length) {
    return (
      <li className={cn("rounded-md", isActive && "bg-zinc-900")}>
        <Button variant="ghost" className={cn("w-full justify-start", isActive && "underline")} asChild>
          <Link href={href}>
            <SidebarIcon icon={icon} />
            {label}
          </Link>
        </Button>
      </li>
    );
  }

  return (
    <li className={cn("rounded-md", isSomeSubmenuActive && "bg-zinc-900")}>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className={cn("w-full justify-start")}>
            <SidebarIcon icon={icon} />
            {label}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-2 pr-2 pl-7">
          {submenus.map((submenu) => (
            <Button
              key={submenu.href}
              variant="ghost"
              className={cn("w-full justify-start", submenu.isSubmenuActive && "underline")}
              asChild
            >
              <Link href={submenu.href}>{submenu.label}</Link>
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  href: string;
  label: string;
  isActive: boolean;
}

export function SidebarMenuItem({ href, icon: Icon, label, isActive }: SidebarMenuItemProps) {
  return (
    <li className={cn("rounded-md", isActive && "bg-zinc-900")}>
      <Button variant="ghost" className={cn("w-full justify-start", isActive && "underline")} asChild>
        <Link to={href}>
          <Icon className="mr-2 text-gray-400" size={18} />
          {label}
        </Link>
      </Button>
    </li>
  );
}

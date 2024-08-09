"use client";

import { Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SidebarConfig() {
  const pathname = usePathname();
  const isActive = pathname.includes("/dash/config");

  return (
    <Button className={cn("w-full", isActive && "bg-accent")} asChild variant="outline">
      <Link href="/dash/config">
        <SettingsIcon className="mr-2" size={20} />
        Configurations
      </Link>
    </Button>
  );
}

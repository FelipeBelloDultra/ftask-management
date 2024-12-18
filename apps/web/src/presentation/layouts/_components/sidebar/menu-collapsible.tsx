import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { LucideIconType } from "@/presentation/components/icons";
import { Button } from "@/presentation/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/presentation/components/ui/collapsible";

interface MenuCollapsibleProps {
  onSubmenuCollapsibleToggled(): void;
  openedMenuKey: string | null;
  menuKey: string;
  icon: LucideIconType;
  label: string;
  submenus: Array<{
    label: string;
    href: string;
    isSubmenuActive: boolean;
  }>;
}

export function MenuCollapsible({
  onSubmenuCollapsibleToggled,
  menuKey,
  openedMenuKey,
  icon: Icon,
  label,
  submenus,
}: MenuCollapsibleProps) {
  const isSomeSubmenuActive = submenus.some((submenu) => submenu.isSubmenuActive);

  return (
    <li className={cn("rounded-md", isSomeSubmenuActive && "bg-accent/50")}>
      <Collapsible onOpenChange={onSubmenuCollapsibleToggled} open={isSomeSubmenuActive || openedMenuKey === menuKey}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className={cn("w-full justify-start")}>
            <Icon className="mr-2 text-gray-400" size={18} />
            {label}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-2">
          {/* <div className="h-px bg-muted"></div> */}

          <div className="my-2 pr-2 pl-7">
            {submenus.map((submenu) => (
              <Button
                key={submenu.href}
                variant="ghost"
                className={cn("w-full justify-start text-xs", submenu.isSubmenuActive && "underline font-bold")}
                asChild
              >
                <Link to={submenu.href}>{submenu.label}</Link>
              </Button>
            ))}
          </div>

          {/* <div className="h-px bg-muted"></div> */}
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

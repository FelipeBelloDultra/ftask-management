import { ChevronDown as ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationFiltersProps {
  read: boolean;
  onSetRead: (read: boolean) => void;
}

export function NotificationFilters({ read, onSetRead }: NotificationFiltersProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          {read ? "Read" : "Unread"} <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSetRead(false)}>Unread</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSetRead(true)}>Read</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

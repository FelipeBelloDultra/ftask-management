import { ChevronDown as ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationFiltersProps {
  read?: boolean;
  onSetRead: (read?: boolean) => void;
}

export function NotificationFilters({ read, onSetRead }: NotificationFiltersProps) {
  const hasReadFilterApplied = read !== undefined;

  function getFilterTitle() {
    if (hasReadFilterApplied) {
      return read ? "Read" : "Unread";
    }

    return "All";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          {getFilterTitle()} <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSetRead()}>All</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSetRead(false)}>Unread</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSetRead(true)}>Read</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

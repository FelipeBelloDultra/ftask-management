import { Link } from "react-router-dom";

import { LogOutIcon, UserPenIcon } from "@/presentation/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/presentation/components/ui/avatar";
import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { useAuth } from "@/presentation/hooks/use-auth";

interface ProfileDropdownProps {
  user: {
    email: string;
    pictureUrl: string | null;
    name: string;
  };
}

function getInitials(name: string) {
  if (!name) return "";

  const words = name.trim().split(/\s+/);

  const initials = words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return initials;
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const { signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            {user.pictureUrl ? <AvatarImage width={32} height={32} src={user.pictureUrl} /> : null}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <p className="truncate">{user.email}</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-2">
          <DropdownMenuItem asChild>
            <Link to="/dash/settings/profile" className="cursor-pointer text-muted-foreground">
              <UserPenIcon className="mr-2" size={20} />
              Edit profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer text-muted-foreground" onClick={signOut}>
            <LogOutIcon className="mr-2" size={20} />
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { LogOut as LogOutIcon, UserPen as UserPenIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/user";

interface HeaderProfileProps {
  user: {
    email: string;
    pictureUrl: string | null;
    name: string;
  };
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);

  const initials = words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return initials;
}

export function HeaderProfileDropdown({ user }: HeaderProfileProps) {
  const router = useRouter();
  const { actions } = useUserStore();

  async function logoutUser() {
    await signOut({
      redirect: false,
    });
    actions.clearUser();

    router.replace("/sign-in");
  }

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
            <Link href="/dash/config/profile" className="cursor-pointer text-muted-foreground">
              <UserPenIcon className="mr-2" size={20} />
              Edit profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer text-muted-foreground" onClick={logoutUser}>
            <LogOutIcon className="mr-2" size={20} />
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
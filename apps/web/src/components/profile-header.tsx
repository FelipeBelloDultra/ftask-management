"use client";
import { LogOut as LogOutIcon, UserPen as UserPenIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ProfileHeader() {
  const router = useRouter();

  async function logoutUser() {
    await signOut({
      redirect: false,
    });

    router.replace("/sign-in");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage width={32} height={32} src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-2">
          <DropdownMenuItem asChild>
            <Link href="/dash/profile/edit" className="cursor-pointer text-muted-foreground">
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

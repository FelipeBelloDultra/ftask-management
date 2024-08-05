"use client";

import { LogIn as LogInIcon, UserPlus as UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";

export function AuthActionButton() {
  const pathname = usePathname();
  const isInLoginPage = pathname === "/sign-in";

  return (
    <Button asChild variant="outline" className="absolute right-8 top-8 font-bold">
      {isInLoginPage ? (
        <Link prefetch={false} href="/sign-up">
          <UserPlusIcon className="mr-2" size={20} />
          Register
        </Link>
      ) : (
        <Link prefetch={false} href="/sign-in">
          <LogInIcon className="mr-2" size={20} />
          Login
        </Link>
      )}
    </Button>
  );
}

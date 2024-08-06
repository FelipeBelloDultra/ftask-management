"use client";

import { LogOut as LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Button } from "./ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function logoutUser() {
    await signOut({
      redirect: false,
    });

    router.replace("/sign-in");
  }

  return (
    <Button onClick={logoutUser} variant="outline">
      <LogOutIcon className="mr-2" size={20} />
      Logout
    </Button>
  );
}

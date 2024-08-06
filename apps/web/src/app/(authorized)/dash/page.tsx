"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function DashPage() {
  const router = useRouter();

  async function logoutUser() {
    await signOut({
      redirect: false,
    });
    router.replace("/sign-in");
  }

  return (
    <>
      <div>Main dashboard page</div>

      <Button onClick={logoutUser} variant="outline">
        Logout
      </Button>
    </>
  );
}

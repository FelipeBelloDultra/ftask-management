import { setTimeout } from "node:timers/promises";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { nextAuthOptions } from "@/config/next-auth";

export default async function DashPage() {
  const session = await getServerSession(nextAuthOptions);
  await setTimeout(3000);

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <div>Main dashboard page</div>
      <nav className="flex items-center space-x-4">{session.user.name}</nav>
    </>
  );
}

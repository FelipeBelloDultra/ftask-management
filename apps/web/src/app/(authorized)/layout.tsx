import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { nextAuthOptions } from "@/config/next-auth";

export default async function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <span>
      <nav className="flex items-center space-x-4">{session.user.name}</nav>
      {children}
    </span>
  );
}

import { Terminal as TerminalIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AuthActionButton } from "@/components/auth-action-button";
import { nextAuthOptions } from "@/config/next-auth";

export default async function UnauthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(nextAuthOptions);

  if (session) {
    redirect("/dash");
  }

  return (
    <section className="flex min-h-screen">
      <aside className="flex flex-col justify-between w-1/2 p-8 bg-zinc-900 text-white">
        <header className="flex items-center space-x-2">
          <TerminalIcon size={32} />

          <h1 className="text-3xl font-semibold tracking-wider">FTask Management</h1>
        </header>
        <article className="p-8">
          <p className="text-base text-muted-foreground">
            Continue with your account, manage, participate and receive project reports easily.{" "}
            <b>From devs to devs.</b>
          </p>
        </article>
      </aside>

      <AuthActionButton />

      <main className="flex flex-col justify-center w-1/2 p-8 text-white">{children}</main>
    </section>
  );
}

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { nextAuthOptions } from "@/config/next-auth";
import { useUserStore } from "@/store/user";

export default async function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect("/sign-in");
  }

  useUserStore.setState({
    state: {
      user: {
        email: session.user.email,
        id: session.user.id,
        name: session.user.name,
        pictureUrl: session.user.picture_url,
        token: session.user.token,
      },
    },
  });

  return (
    <main className="pl-72 pt-20 relative min-h-screen">
      <Sidebar.Root />

      <div className="fixed top-0 right-0 left-72 bg-zinc-950">
        <Suspense fallback={<Header.Loading />}>
          <Header.Root />
        </Suspense>
      </div>

      <section className="h-full overflow-auto">{children}</section>
    </main>
  );
}

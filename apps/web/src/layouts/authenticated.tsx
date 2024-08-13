import { Suspense } from "react";
import { Outlet, redirect } from "react-router-dom";

import { Header } from "@/components/header";
import { PageContent } from "@/components/page-content";
import { Sidebar } from "@/components/sidebar";
import { useUserStore } from "@/store/user";

export function AuthenticatedLayout() {
  const session = true;

  if (!session) {
    redirect("/sign-in");
  }

  useUserStore.setState({
    state: {
      user: {
        email: "session.user.email",
        id: "session.user.id",
        name: "session.user.name",
        pictureUrl: "session.user.picture_url",
        token: "session.user.token",
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

      <PageContent>
        {" "}
        <Outlet />
      </PageContent>
    </main>
  );
}

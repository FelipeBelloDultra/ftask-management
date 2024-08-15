import { useQuery } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "@/components/header";
import { PageContent } from "@/components/page-content";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { showAuthenticatedUserService } from "@/services/show-authenticated-user";
import { useUserStore } from "@/store/user";

export function AuthenticatedLayout() {
  const { signOut } = useAuth();
  const { actions } = useUserStore();
  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ["authenticated-user"],
    queryFn: () => showAuthenticatedUserService(),
    gcTime: 1,
  });

  useEffect(() => {
    if (!error) return;

    signOut();
    actions.clearUser();
  }, [error]);

  useEffect(() => {
    if (!data) return;

    actions.addUser({
      email: data.email,
      id: data.id,
      name: data.name,
      pictureUrl: data.pictureUrl,
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex space-x-2 justify-center items-center h-screen">
        <span className="sr-only">Loading...</span>
        <div className="h-8 w-8 bg-muted rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-muted rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-muted rounded-full animate-bounce"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <main className="pl-72 pt-20 relative min-h-screen">
        <Sidebar.Root />

        <div className="fixed top-0 right-0 left-72 bg-zinc-950">
          <Suspense fallback={<Header.Loading />}>
            <Header.Root />
          </Suspense>
        </div>

        <PageContent>
          <Outlet />
        </PageContent>
      </main>
    );
  }
}

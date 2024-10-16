import { useQuery } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { PageContent } from "@/presentation/components/page-content";
import { useUserStore } from "@/presentation/store/user";
import { showAuthenticatedUserService } from "@/services/show-authenticated-user";

import { Choose, Otherwise, When } from "../components/conditionals";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../hooks/use-auth";

import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";

export function AuthenticatedLayout() {
  const { signOut } = useAuth();
  const { actions } = useUserStore();
  const { data, error, isSuccess } = useQuery({
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

  return (
    <Choose>
      <When condition={isSuccess}>
        <main className="h-screen flex flex-col">
          <Suspense fallback={<Header.Loading />}>
            <Header.Root />
          </Suspense>

          <div className="flex flex-1">
            <div className="h-[calc(100vh-3.5rem)]">
              <Sidebar.Root />
            </div>

            <PageContent>
              <Suspense fallback={<Skeleton className="w-full top-20 left-72 z-50 h-3 rounded-none" />}>
                <Outlet />
              </Suspense>
            </PageContent>
          </div>
        </main>
      </When>
      <Otherwise>
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-12 w-12" />
            <p className="text-primary-foreground font-medium">Loading...</p>
          </div>
        </div>
      </Otherwise>
    </Choose>
  );
}

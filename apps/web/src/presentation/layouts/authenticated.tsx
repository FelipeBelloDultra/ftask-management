import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { PageContent } from "@/presentation/components/page-content";

import { Choose, Otherwise, When } from "../components/conditionals";
import { Skeleton } from "../components/ui/skeleton";
import { useDependencies } from "../hooks/use-dependencies";
import { useLayouts } from "../hooks/use-layouts";

import { Header } from "./_components/header";
import { SkeletonHeaderLoading } from "./_components/header/loadings";
import { Sidebar } from "./_components/sidebar";

export function AuthenticatedLayout() {
  const { profileAdapter } = useDependencies();
  const { wasUserDataLoadedSuccessfully } = useLayouts({ profileAdapter });

  return (
    <Choose>
      <When condition={wasUserDataLoadedSuccessfully}>
        <main className="h-screen flex flex-col">
          <Suspense fallback={<SkeletonHeaderLoading />}>
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

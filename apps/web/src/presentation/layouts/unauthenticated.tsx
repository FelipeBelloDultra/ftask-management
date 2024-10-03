import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { TerminalIcon } from "@/presentation/components/icons";

import { AuthActionButton } from "./_components/auth-action-button";
import { SkeletonLoadingUnauthenticatedPage } from "./_components/loadings";

export function UnauthenticatedLayout() {
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

      <main className="flex flex-col justify-center w-1/2 p-8 text-white">
        <Suspense fallback={<SkeletonLoadingUnauthenticatedPage />}>
          <Outlet />
        </Suspense>
      </main>
    </section>
  );
}

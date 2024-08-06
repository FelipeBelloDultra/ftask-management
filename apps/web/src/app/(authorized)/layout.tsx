import { Suspense } from "react";

import { Header } from "@/components/header";

import Loading from "./loading";

export default async function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <span>
      <Header />
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </span>
  );
}

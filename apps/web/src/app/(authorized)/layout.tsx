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
      <Suspense fallback={<Header.Loading />}>
        <Header.Root />
      </Suspense>

      <Suspense fallback={<Loading />}>{children}</Suspense>
    </span>
  );
}

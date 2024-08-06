import { Suspense } from "react";

import Loading from "./loading";

export default async function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <span>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </span>
  );
}

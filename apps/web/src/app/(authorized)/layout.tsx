import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

import { Header } from "@/components/header";
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
    <span>
      <Suspense fallback={<Header.Loading />}>
        <Header.Root />
      </Suspense>

      {children}
    </span>
  );
}

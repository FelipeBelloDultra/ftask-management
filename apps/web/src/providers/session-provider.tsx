"use client";

import { SessionProvider as AuthSessionProvider } from "next-auth/react";
import React from "react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
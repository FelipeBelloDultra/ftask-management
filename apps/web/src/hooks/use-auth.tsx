import { useContext } from "react";

import { AuthenticationContext } from "@/providers/authentication-provider";

export function useAuth() {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error("useAuth must be within AuthenticationContext");
  }

  return context;
}

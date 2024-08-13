import { ReactNode } from "react";

import { AuthenticationProvider } from "./authentication-provider";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return <AuthenticationProvider>{children}</AuthenticationProvider>;
}

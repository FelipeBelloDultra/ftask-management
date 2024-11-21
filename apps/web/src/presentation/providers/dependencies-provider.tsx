import { createContext, ReactNode } from "react";

import { AuthAdapter, buildAuthAdapter } from "@/adapters/auth-adapter";
import { HttpClientAdapter } from "@/infra/adapter/fetch-adapter-http";

interface DependenciesProviderProps {
  children: ReactNode;
}

interface DependenciesContextProps {
  authAdapter: AuthAdapter;
}

export const DependenciesContext = createContext({} as DependenciesContextProps);

export function DependenciesProvider({ children }: DependenciesProviderProps) {
  const httpClient = new HttpClientAdapter();

  return (
    <DependenciesContext.Provider
      value={{
        authAdapter: buildAuthAdapter(httpClient),
      }}
    >
      {children}
    </DependenciesContext.Provider>
  );
}

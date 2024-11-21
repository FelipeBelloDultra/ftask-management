import { createContext, ReactNode } from "react";

import { AuthAdapter, AuthHttpAdapter } from "@/adapters/auth-adapter";
import { HttpClientAdapter } from "@/infra/adapter/fetch-adapter-http";

interface DependenciesProviderProps {
  children: ReactNode;
}

interface DependenciesContextProps {
  authAdapter: AuthAdapter;
}

export const DependenciesContext = createContext({} as DependenciesContextProps);

const httpClient = new HttpClientAdapter();

export function DependenciesProvider({ children }: DependenciesProviderProps) {
  const dependencies: DependenciesContextProps = {
    authAdapter: new AuthHttpAdapter(httpClient),
  };

  return <DependenciesContext.Provider value={dependencies}>{children}</DependenciesContext.Provider>;
}

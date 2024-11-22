import { createContext, ReactNode } from "react";

import { AuthAdapter, AuthHttpAdapter } from "@/adapters/auth-adapter";
import { ProfileAdapter, ProfileHttpAdapter } from "@/adapters/profile-adapter";
import { HttpClientAdapter } from "@/infra/adapter/fetch-adapter-http";

interface DependenciesProviderProps {
  children: ReactNode;
}

interface DependenciesContextProps {
  authAdapter: AuthAdapter;
  profileAdapter: ProfileAdapter;
}

export const DependenciesContext = createContext({} as DependenciesContextProps);

const httpClient = new HttpClientAdapter();

export function DependenciesProvider({ children }: DependenciesProviderProps) {
  const dependencies: DependenciesContextProps = {
    authAdapter: new AuthHttpAdapter(httpClient),
    profileAdapter: new ProfileHttpAdapter(httpClient),
  };

  return <DependenciesContext.Provider value={dependencies}>{children}</DependenciesContext.Provider>;
}

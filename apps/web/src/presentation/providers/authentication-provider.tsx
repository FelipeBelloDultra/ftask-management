import { createContext, ReactNode, useCallback, useState } from "react";

import { env } from "@/config/env";

import { useDependencies } from "../hooks/use-dependencies";

interface SignInData {
  email: string;
  password: string;
}

interface AuthenticationContextProps {
  signIn(data: SignInData): Promise<void>;
}

interface AuthenticationProviderProps {
  children: ReactNode;
}

export const AuthenticationContext = createContext({} as AuthenticationContextProps);

export function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const { authAdapter } = useDependencies();

  const signIn = useCallback(async (data: SignInData) => {
    const { token } = await authAdapter.signIn(data);

    localStorage.setItem(env.jwtPrefix, token);
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        signIn,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

import { createContext, ReactNode, useCallback, useState } from "react";

import { env } from "@/config/env";

import { useDependencies } from "../hooks/use-dependencies";

interface SignInData {
  email: string;
  password: string;
}

interface AuthenticationContextProps {
  signIn(data: SignInData): Promise<void>;
  signedIn: boolean;
}

interface AuthenticationProviderProps {
  children: ReactNode;
}

export const AuthenticationContext = createContext({} as AuthenticationContextProps);

export function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const [signedIn, setSignedIn] = useState(() => !!localStorage.getItem(env.jwtPrefix));
  const { authAdapter } = useDependencies();

  const signIn = useCallback(async (data: SignInData) => {
    const { token } = await authAdapter.signIn(data);

    localStorage.setItem(env.jwtPrefix, token);

    setSignedIn(true);
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        signedIn,
        signIn,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

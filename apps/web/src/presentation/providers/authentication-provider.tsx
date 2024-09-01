import { createContext, ReactNode, useCallback, useState } from "react";

import { env } from "@/config/env";
import { useUserStore } from "@/presentation/store/user";
import { authenticateUserService } from "@/services/authenticate-user-service";

interface SignInData {
  email: string;
  password: string;
}

interface AuthenticationContextProps {
  signOut(): void;
  signIn(data: SignInData): Promise<void>;
  signedIn: boolean;
}

interface AuthenticationProviderProps {
  children: ReactNode;
}

export const AuthenticationContext = createContext({} as AuthenticationContextProps);

export function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const [signedIn, setSignedIn] = useState(() => !!localStorage.getItem(env.jwtPrefix));
  const { actions } = useUserStore();

  const signOut = useCallback(() => {
    actions.clearUser();
    setSignedIn(false);
    localStorage.removeItem(env.jwtPrefix);
  }, []);

  const signIn = useCallback(async (data: SignInData) => {
    const { token } = await authenticateUserService(data);

    localStorage.setItem(env.jwtPrefix, token);

    setSignedIn(true);
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        signedIn,
        signOut,
        signIn,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

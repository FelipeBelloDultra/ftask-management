import { createContext, ReactNode, useCallback, useState } from "react";

import { authenticateUserService } from "@/services/authenticate-user-service";
import { useUserStore } from "@/store/user";

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
  const [signedIn, setSignedIn] = useState(() => !!localStorage.getItem("@_at"));
  const { actions } = useUserStore();

  const signOut = useCallback(() => {
    actions.clearUser();
    setSignedIn(false);
  }, []);

  const signIn = useCallback(async (data: SignInData) => {
    const { token } = await authenticateUserService(data);

    localStorage.setItem("@_at", token);

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

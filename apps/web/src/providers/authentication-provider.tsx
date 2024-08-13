import { createContext, ReactNode } from "react";
import { replace } from "react-router-dom";

import { useUserStore } from "@/store/user";

interface AuthenticationContextProps {
  logoutUser(): Promise<void>;
}

interface AuthenticationProviderProps {
  children: ReactNode;
}

export const AuthenticationContext = createContext({} as AuthenticationContextProps);

export function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const { actions } = useUserStore();

  async function logoutUser() {
    // await signOut({
    //   redirect: false,
    // });
    actions.clearUser();

    replace("/sign-in");
  }

  return (
    <AuthenticationContext.Provider
      value={{
        logoutUser,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

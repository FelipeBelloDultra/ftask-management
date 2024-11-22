import { env } from "@/config/env";

import { useSignedInStore, useUserStore } from "../store/user";

export function useLogout() {
  const { actions: userActions } = useUserStore();
  const { actions: signedInActions } = useSignedInStore();

  return function logout() {
    userActions.clearUser();
    signedInActions.setSignedOut();
    localStorage.removeItem(env.jwtPrefix);
  };
}

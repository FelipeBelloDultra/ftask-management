import { replace } from "react-router-dom";

import { useUserStore } from "@/store/user";

export function useAuth() {
  // const router = useRouter();
  const { actions } = useUserStore();

  async function logoutUser() {
    // await signOut({
    //   redirect: false,
    // });
    actions.clearUser();

    replace("/sign-in");
  }

  return {
    logoutUser,
  };
}

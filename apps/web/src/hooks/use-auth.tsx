import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { useUserStore } from "@/store/user";

export function useAuth() {
  const router = useRouter();
  const { actions } = useUserStore();

  async function logoutUser() {
    await signOut({
      redirect: false,
    });
    actions.clearUser();

    router.replace("/sign-in");
  }

  return {
    logoutUser,
  };
}

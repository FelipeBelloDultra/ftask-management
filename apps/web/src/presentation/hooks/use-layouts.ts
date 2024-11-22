import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { ProfileAdapter } from "@/adapters/profile-adapter";
import { useUserStore } from "@/presentation/store/user";

import { useLogout } from "./use-logout";

interface UseLayoutsProps {
  profileAdapter: ProfileAdapter;
}

export function useLayouts({ profileAdapter }: UseLayoutsProps) {
  const logout = useLogout();
  const { actions } = useUserStore();
  const { data, error, isSuccess } = useQuery({
    queryKey: ["authenticated-user"],
    queryFn: () => profileAdapter.getAuthenticated(),
    gcTime: 1,
  });

  useEffect(() => {
    if (!error) return;

    logout();
    actions.clearUser();
  }, [error]);

  useEffect(() => {
    if (!data) return;

    actions.addUser({
      email: data.email,
      id: data.id,
      name: data.name,
      pictureUrl: data.pictureUrl,
    });
  }, [data]);

  return {
    wasUserDataLoadedSuccessfully: isSuccess,
  };
}

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { AuthAdapter } from "@/adapters/auth-adapter";
import { useAuth } from "@/presentation/hooks/use-auth";
import { useUserStore } from "@/presentation/store/user";

interface UseLayoutsProps {
  authAdapter: AuthAdapter;
}

export function useLayouts({ authAdapter }: UseLayoutsProps) {
  const { signOut } = useAuth();
  const { actions } = useUserStore();
  const { data, error, isSuccess } = useQuery({
    queryKey: ["authenticated-user"],
    queryFn: () => authAdapter.getAuthenticated(),
    gcTime: 1,
  });

  useEffect(() => {
    if (!error) return;

    signOut();
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

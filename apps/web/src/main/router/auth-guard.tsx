import { Navigate, Outlet } from "react-router-dom";

import { useSignedInStore } from "@/presentation/store/user";

interface AuthGuardProps {
  isPrivate?: boolean;
}

export function AuthGuard({ isPrivate }: AuthGuardProps) {
  const { state } = useSignedInStore();

  if (!state.isSignedIn && isPrivate) {
    return <Navigate to="/sign-in" replace />;
  }

  if (state.isSignedIn && !isPrivate) {
    return <Navigate to="/dash" replace />;
  }

  return <Outlet />;
}

import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/presentation/hooks/use-auth";

interface AuthGuardProps {
  isPrivate?: boolean;
}

export function AuthGuard({ isPrivate }: AuthGuardProps) {
  const { signedIn } = useAuth();

  if (!signedIn && isPrivate) {
    return <Navigate to="/sign-in" replace />;
  }

  if (signedIn && !isPrivate) {
    return <Navigate to="/dash" replace />;
  }

  return <Outlet />;
}

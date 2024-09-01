import { LogIn as LogInIcon, UserPlus as UserPlusIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/presentation/components/ui/button";

export function AuthActionButton() {
  const location = useLocation();
  const isInLoginPage = location.pathname === "/sign-in";

  return (
    <Button asChild variant="outline" className="absolute right-8 top-8 font-bold">
      {isInLoginPage ? (
        <Link to="/sign-up">
          <UserPlusIcon className="mr-2" size={20} />
          Register
        </Link>
      ) : (
        <Link to="/sign-in">
          <LogInIcon className="mr-2" size={20} />
          Login
        </Link>
      )}
    </Button>
  );
}

import { Link, useLocation } from "react-router-dom";

import { LogInIcon, UserPlusIcon } from "@/presentation/components/icons";
import { ThemeToggle } from "@/presentation/components/theme-toggle";
import { Button } from "@/presentation/components/ui/button";

export function AuthActionButton() {
  const location = useLocation();
  const isInLoginPage = location.pathname === "/sign-in";

  return (
    <div className="absolute right-8 top-8 flex gap-4">
      <ThemeToggle />

      <Button asChild variant="outline" className="font-bold">
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
    </div>
  );
}

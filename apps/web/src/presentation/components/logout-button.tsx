import { useAuth } from "../hooks/use-auth";

import { LogOutIcon } from "./icons";
import { Button } from "./ui/button";

export function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <Button size="sm" variant="outline" className="w-full" onClick={signOut}>
      <LogOutIcon className="mr-2" size={20} />
      Logout
    </Button>
  );
}

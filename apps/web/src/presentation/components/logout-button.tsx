import { useLogout } from "../hooks/use-logout";

import { LogOutIcon } from "./icons";
import { Button } from "./ui/button";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <Button size="sm" variant="outline" className="w-full" onClick={logout}>
      <LogOutIcon className="mr-2" size={20} />
      Logout
    </Button>
  );
}

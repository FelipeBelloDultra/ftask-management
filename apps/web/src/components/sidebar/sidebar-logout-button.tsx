import { LogOut as LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function SidebarLogoutButton() {
  const { signOut } = useAuth();

  return (
    <Button className="w-full" variant="outline" onClick={signOut}>
      <LogOutIcon className="mr-2" size={20} />
      Logout
    </Button>
  );
}

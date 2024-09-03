import { LogOutIcon } from "@/presentation/components/icons";
import { Button } from "@/presentation/components/ui/button";
import { useAuth } from "@/presentation/hooks/use-auth";

export function SidebarLogoutButton() {
  const { signOut } = useAuth();

  return (
    <Button className="w-full" variant="outline" onClick={signOut}>
      <LogOutIcon className="mr-2" size={20} />
      Logout
    </Button>
  );
}

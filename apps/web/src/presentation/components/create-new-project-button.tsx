import { PlusCircleIcon } from "@/presentation/components/icons";
import { Button } from "@/presentation/components/ui/button";

export function CreateNewProjectButton() {
  return (
    <Button size="sm" className="w-full" onClick={() => {}}>
      <PlusCircleIcon className="mr-2" size={20} />
      New project
    </Button>
  );
}

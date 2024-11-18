import { PlusCircleIcon } from "@/presentation/components/icons";
import { Button } from "@/presentation/components/ui/button";

import { useCreateProject } from "../hooks/use-create-project";

export function CreateNewProjectButton() {
  const { navigateToRoute } = useCreateProject();

  return (
    <Button size="sm" className="w-full" onClick={navigateToRoute}>
      <PlusCircleIcon className="mr-2" size={20} />
      New project
    </Button>
  );
}

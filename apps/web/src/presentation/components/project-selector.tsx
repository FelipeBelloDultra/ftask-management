// import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { ArrowDownIcon, PlusCircleIcon } from "@/presentation/components/icons";
import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
// import { fetchInvolvedProjectsService } from "@/services/fetch-involved-projects";

import { useCreateProject } from "../hooks/use-create-project";

import { ScrollArea } from "./ui/scroll-area";

function EmptyProjectSelector() {
  return (
    <div className="p-4 text-center">
      <h2 className="text-lg font-bold">No projects found</h2>
      <p className="mt-2 text-sm text-gray-600">
        You haven't joined any projects yet. To get started, create a new project or join an existing one.
      </p>
    </div>
  );
}

const PROJECTS = [
  // Add your project options here
  {
    id: Date.now() + Math.random(),
    name: "Project 1",
    isOwner: false,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 2",
    isOwner: false,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 3",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 4",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 5",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 6",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 7",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 8",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 9",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 10",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 11",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 12",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 13",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 14",
    isOwner: true,
    iconUrl: "project",
  },
  {
    id: Date.now() + Math.random(),
    name: "Project 15",
    isOwner: true,
    iconUrl: "project",
  },
];

export function ProjectSelector() {
  const { navigateToRoute } = useCreateProject();
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  // const { data } = useSuspenseQuery({
  //   queryKey: ["projects"],
  //   queryFn: () => fetchInvolvedProjectsService(),
  // });

  // console.log({ data });

  return (
    <DropdownMenu modal={false} onOpenChange={(isOpened) => setIsDropdownOpened(isOpened)}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <span>Projects I'm involved in</span>

          <ArrowDownIcon
            size={16}
            className={cn("ml-2 transition-transform duration-300", isDropdownOpened ? "-rotate-180" : "rotate-0")}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="p-2 w-72">
        <div className="max-h-60 overflow-scroll">
          <ScrollArea>
            {PROJECTS.length > 0 ? (
              PROJECTS.map((project) => (
                <DropdownMenuItem key={project.id} className="cursor-pointer" asChild>
                  <Link to="/">{project.name}</Link>
                </DropdownMenuItem>
              ))
            ) : (
              <EmptyProjectSelector />
            )}
          </ScrollArea>
        </div>

        <Button
          asChild
          size="sm"
          className="w-full cursor-pointer focus:bg-primary/90 focus:text-primary-foreground"
          onClick={navigateToRoute}
        >
          <DropdownMenuItem>
            <PlusCircleIcon className="mr-2" size={20} />
            New project
          </DropdownMenuItem>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

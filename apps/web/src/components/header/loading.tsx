import { ChevronRight as ChevronRightIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export function HeaderLoading() {
  return (
    <header className="flex justify-between items-center h-20 px-4 border-b w-full">
      <span className="inline-flex items-center h-5 gap-1.5">
        <Skeleton className="h-full w-20" />
        <ChevronRightIcon size={18} className="text-muted-foreground" />
        <Skeleton className="h-full w-14" />
      </span>

      <section className="flex gap-4 items-center">
        <Skeleton className="h-10 w-10" />

        <Skeleton className="h-10 w-10 rounded-full" />
      </section>
    </header>
  );
}

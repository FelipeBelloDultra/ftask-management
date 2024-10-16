import { ChevronRightIcon } from "@/presentation/components/icons";
import { Skeleton } from "@/presentation/components/ui/skeleton";

export function HeaderLoading() {
  return (
    <header className="flex justify-between items-center h-14 px-4 border-b w-full bg-accent/50">
      <span className="inline-flex items-center h-5 gap-1.5">
        <Skeleton className="h-full w-20" />
        <ChevronRightIcon size={18} className="text-muted-foreground" />
        <Skeleton className="h-full w-14" />
      </span>

      <section className="flex gap-3 items-center">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </section>
    </header>
  );
}

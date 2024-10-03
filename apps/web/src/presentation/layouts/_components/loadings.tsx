import { Skeleton } from "@/presentation/components/ui/skeleton";

export function SkeletonLoadingUnauthenticatedPage() {
  return (
    <section className="max-w-md w-full mx-auto">
      <Skeleton className="mb-2 h-8 w-[400px]" />
      <Skeleton className="mb-6 h-5 w-[420px]" />

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Skeleton className="h-[18px] w-9" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-[18px] w-9" />
          <Skeleton className="h-10 w-full" />
        </div>

        <Skeleton className="h-10 rounded-md" />
      </div>

      <Skeleton className="h-8 w-[200px] mt-1" />
    </section>
  );
}

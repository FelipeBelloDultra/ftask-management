import { Skeleton } from "@/presentation/components/ui/skeleton";

export function SkeletonLoadingDetailTitle() {
  return <Skeleton className="size-[18px] w-[230px]" />;
}

export function SkeletonLoadingDetailContent() {
  return (
    <>
      <Skeleton className="h-[16px] w-[400px] mb-2" />
      <Skeleton className="h-[16px] w-[200px]" />
    </>
  );
}

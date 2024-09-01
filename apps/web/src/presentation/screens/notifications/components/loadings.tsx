import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function SkeletonLoadingTableData() {
  return Array.from({ length: 10 }).map((_, index) => (
    <TableRow key={`skeleton-loading-table-data-${index}`}>
      <TableCell>
        <Skeleton className="size-[20px]" />
      </TableCell>
      <TableCell className="font-medium">
        <Skeleton className="h-[20px] w-[550px]" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-[20px] w-[100px] ml-auto" />
      </TableCell>
    </TableRow>
  ));
}

export function SkeletonLoadingFilters() {
  return <Skeleton className="h-[40px] w-[75px] ml-auto" />;
}

export function SkeletonLoadingPagination() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-[40px] w-[130px]" />

      <div className="flex items-center gap-4">
        <Skeleton className="h-[20px] w-[110px]" />

        <div className="flex items-center  gap-8">
          <Skeleton className="h-[20px] w-[65px]" />

          <div className="flex items-center space-x-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`skeleton-loading-pagination-${index}`} className="size-8" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

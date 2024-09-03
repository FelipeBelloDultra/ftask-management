import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "@/presentation/components/icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";

import { Button } from "./ui/button";

interface PaginationProps {
  page: number;
  totalCount: number;
  perPage: number;
  onPageChange: (page: number) => Promise<void> | void;
  onLimitPerPageChange: (limit: string) => void;
}

export function Pagination({ page, totalCount, perPage, onPageChange, onLimitPerPageChange }: PaginationProps) {
  const pages = Math.ceil(totalCount / perPage) || 1;

  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <Select onValueChange={onLimitPerPageChange}>
          <SelectTrigger className="gap-2">
            Per page
            <SelectValue placeholder={perPage} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Items per page</SelectLabel>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <span className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Total of {totalCount} item(s)</span>

        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center justify-center text-sm font-medium">
            Page {page} of {pages}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPageChange(1)}
              disabled={page === 1}
            >
              <span className="sr-only">First page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(page + 1)}
              disabled={pages <= page}
            >
              <span className="sr-only">Next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPageChange(pages)}
              disabled={pages <= page}
            >
              <span className="sr-only">Last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </span>
    </div>
  );
}

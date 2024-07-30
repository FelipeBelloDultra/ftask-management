import { Pagination } from "@/core/entity/pagination";

interface PaginationPresenterToHTTP {
  pagination: Pagination;
  items: Array<unknown>;
  total: number;
}

export class PaginationPresenter {
  public static toHTTP(data: PaginationPresenterToHTTP) {
    const calculated = data.pagination.calculate(data.total);

    return {
      total: {
        records: data.total,
        per_current_page: data.items.length,
        pages: calculated.totalPages,
      },
      page: {
        next: calculated.hasNextPage ? calculated.currentPage + 1 : null,
        current: calculated.currentPage,
        prev: calculated.hasPreviousPage ? calculated.currentPage - 1 : null,
      },
      limit: data.pagination.limit,
    };
  }
}

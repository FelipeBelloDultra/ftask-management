import { Pagination } from "@/domain/pagination";
import { PaginationPage } from "@/domain/value-objects/pagination-page";
import { PaginationTotal } from "@/domain/value-objects/pagination-total";

export interface PersistencePagination {
  total: {
    records: number;
    per_current_page: number;
    pages: number;
  };
  page: {
    next: number | null;
    current: number;
    prev: number | null;
  };
  limit: number;
}

export class PaginationMapper {
  public static toDomain(raw: PersistencePagination): Pagination {
    return Pagination.create({
      page: PaginationPage.create({
        current: raw.page.current,
        next: raw.page.next,
        prev: raw.page.prev,
      }),
      total: PaginationTotal.create({
        pages: raw.total.pages,
        perCurrentPage: raw.total.per_current_page,
        records: raw.total.records,
      }),
      limit: raw.limit,
    });
  }

  public static toPersistence(pagination: Pagination): PersistencePagination {
    return {
      total: {
        records: pagination.total.records,
        per_current_page: pagination.total.perCurrentPage,
        pages: pagination.total.pages,
      },
      page: {
        next: pagination.page.nextPage,
        current: pagination.page.currentPage,
        prev: pagination.page.previousPage,
      },
      limit: pagination.limit,
    };
  }
}

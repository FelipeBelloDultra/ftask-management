import { PaginationPage } from "./value-objects/pagination-page";
import { PaginationTotal } from "./value-objects/pagination-total";

interface PaginationProps {
  total: PaginationTotal;
  page: PaginationPage;
  limit: number;
}

export class Pagination {
  private readonly props: PaginationProps;

  public get total() {
    return this.props.total;
  }

  public get page() {
    return this.props.page;
  }

  public get limit() {
    return this.props.limit;
  }

  private constructor(props: PaginationProps) {
    this.props = props;
  }

  public static create(props: PaginationProps) {
    return new Pagination(props);
  }
}

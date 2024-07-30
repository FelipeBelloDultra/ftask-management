import { ValueObject } from "./value-object";

interface PaginationProps {
  page: number;
  limit: number;
}

export class Pagination extends ValueObject<PaginationProps> {
  public get page() {
    return this.props.page;
  }

  public get limit() {
    return this.props.limit;
  }

  public get skip() {
    return (this.props.page - 1) * this.props.limit;
  }

  public get take() {
    return this.props.page * this.props.limit;
  }

  public static create(props: PaginationProps): Pagination {
    return new Pagination(props);
  }
}

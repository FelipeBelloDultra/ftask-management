interface PaginationTotalProps {
  records: number;
  perCurrentPage: number;
  pages: number;
}

export class PaginationTotal {
  private readonly props: PaginationTotalProps;

  public get records() {
    return this.props.records;
  }

  public get perCurrentPage() {
    return this.props.perCurrentPage;
  }

  public get pages() {
    return this.props.pages;
  }

  private constructor(props: PaginationTotalProps) {
    this.props = props;
  }

  public static create(props: PaginationTotalProps) {
    return new PaginationTotal(props);
  }
}

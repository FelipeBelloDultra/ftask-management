interface PaginationPageProps {
  next: number | null;
  current: number;
  prev: number | null;
}

export class PaginationPage {
  private readonly props: PaginationPageProps;

  public get nextPage() {
    return this.props.next;
  }

  public get currentPage() {
    return this.props.current;
  }

  public get previousPage() {
    return this.props.prev;
  }

  private constructor(props: PaginationPageProps) {
    this.props = props;
  }

  public static create(props: PaginationPageProps) {
    return new PaginationPage(props);
  }
}

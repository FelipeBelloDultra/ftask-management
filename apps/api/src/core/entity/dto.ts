export abstract class Dto<Props> {
  protected props: Props;

  protected constructor(props: Props) {
    this.props = props;
  }
}

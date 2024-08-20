interface NotificationProps {
  id: string;
  title: string;
  createdAt: Date;
  readAt: Date | null;
  content: string;
  recipientId: string;
}

export class Notification {
  private readonly props: NotificationProps;

  public get id() {
    return this.props.id;
  }

  public get title() {
    return this.props.title;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get readAt() {
    return this.props.readAt;
  }

  public get content() {
    return this.props.content;
  }

  public get recipientId() {
    return this.props.recipientId;
  }

  private constructor(props: NotificationProps) {
    this.props = props;
  }

  public static create(props: NotificationProps) {
    return new Notification(props);
  }
}

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

  public relativeCreatedAt(): string {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const now = new Date();
    const diffInSeconds = (+this.createdAt - +now) / 1000;

    const SECONDS_IN_MINUTES = 60; // 1 minute (seconds * seconds)
    const SECONDS_IN_HOURS = SECONDS_IN_MINUTES * 60; // 1 hour (seconds * minutes * hours)
    const SECONDS_IN_DAYS = SECONDS_IN_HOURS * 24; // 1 day (seconds * minutes * hours * days)
    const SECONDS_IN_WEEK = SECONDS_IN_DAYS * 7; // 1 week (seconds * minutes * hours * days * weeks)
    const SECONDS_IN_MONTH = SECONDS_IN_DAYS * 30; // 1 month (seconds * minutes * hours * days * months)
    const SECONDS_IN_YEAR = SECONDS_IN_DAYS * 365; // 1 year (seconds * minutes * hours * days * years)

    const units: [Intl.RelativeTimeFormatUnit, number][] = [
      ["year", SECONDS_IN_YEAR],
      ["month", SECONDS_IN_MONTH],
      ["week", SECONDS_IN_WEEK],
      ["day", SECONDS_IN_DAYS],
      ["hour", SECONDS_IN_HOURS],
      ["minute", SECONDS_IN_MINUTES],
      ["second", 1],
    ];

    const [unit, value] = units.find(([, value]) => Math.abs(diffInSeconds) >= value) || ["second", 1];

    return rtf.format(Math.round(diffInSeconds / value), unit);
  }

  public static create(props: NotificationProps) {
    return new Notification(props);
  }
}

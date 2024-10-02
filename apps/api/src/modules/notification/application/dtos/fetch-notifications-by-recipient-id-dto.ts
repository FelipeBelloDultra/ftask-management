import { Dto } from "@/core/entity/dto";

interface FetchNotificationsByRecipientIdProps {
  recipientId: string;
  limit: number;
  page: number;
  read?: boolean;
}

export class FetchNotificationsByRecipientIdDto extends Dto<FetchNotificationsByRecipientIdProps> {
  public get recipientId() {
    return this.props.recipientId;
  }

  public get read() {
    return this.props.read;
  }

  public get limit() {
    return this.props.limit;
  }

  public get page() {
    return this.props.page;
  }

  public static create(props: FetchNotificationsByRecipientIdProps) {
    return new FetchNotificationsByRecipientIdDto(props);
  }
}

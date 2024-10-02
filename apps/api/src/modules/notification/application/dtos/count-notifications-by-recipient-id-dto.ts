import { Dto } from "@/core/entity/dto";

interface CountNotificationsByRecipientIdProps {
  recipientId: string;
  read: boolean;
}

export class CountNotificationsByRecipientIdDto extends Dto<CountNotificationsByRecipientIdProps> {
  public get recipientId() {
    return this.props.recipientId;
  }

  public get read() {
    return this.props.read;
  }

  public static create(props: CountNotificationsByRecipientIdProps) {
    return new CountNotificationsByRecipientIdDto(props);
  }
}

import { Dto } from "@/core/entity/dto";

interface SendNotificationProps {
  title: string;
  content: string;
  recipientId: string;
  additionalInfos?: Array<{ key: string; value: string }>;
}

export class SendNotificationDto extends Dto<SendNotificationProps> {
  public get recipientId() {
    return this.props.recipientId;
  }

  public get title() {
    return this.props.title;
  }

  public get content() {
    return this.props.content;
  }

  public get additionalInfos() {
    return this.props.additionalInfos;
  }

  public static create(props: SendNotificationProps) {
    return new SendNotificationDto(props);
  }
}

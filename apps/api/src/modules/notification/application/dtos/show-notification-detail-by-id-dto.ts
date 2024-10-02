import { Dto } from "@/core/entity/dto";

interface ShowNotificationDetailByIdProps {
  recipientId: string;
  notificationId: string;
}

export class ShowNotificationDetailByIdDto extends Dto<ShowNotificationDetailByIdProps> {
  public get recipientId() {
    return this.props.recipientId;
  }

  public get notificationId() {
    return this.props.notificationId;
  }

  public static create(props: ShowNotificationDetailByIdProps) {
    return new ShowNotificationDetailByIdDto(props);
  }
}

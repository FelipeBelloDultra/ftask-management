import { Dto } from "@/core/entity/dto";

interface MarkNotificationAsReadProps {
  notificationId: string;
  recipientId: string;
}

export class MarkNotificationAsReadDto extends Dto<MarkNotificationAsReadProps> {
  public get recipientId() {
    return this.props.recipientId;
  }

  public get notificationId() {
    return this.props.notificationId;
  }

  public static create(props: MarkNotificationAsReadProps) {
    return new MarkNotificationAsReadDto(props);
  }
}

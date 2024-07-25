import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Optional } from "~/core/types/optional";

export interface NotificationProps {
  title: string;
  content: string;
  readAt: Date | null;
  wasRead: boolean;
  createdAt: Date;
  recipientId: UniqueEntityID;
}

export class Notification extends Entity<NotificationProps> {
  public read() {
    this.props.wasRead = true;
    this.props.readAt = new Date();
  }

  public static create(props: Optional<NotificationProps, "createdAt" | "wasRead" | "readAt">, id?: UniqueEntityID) {
    const notificationWasRead = (!!props.readAt || props.wasRead) ?? false;

    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        wasRead: notificationWasRead,
        readAt: props.readAt ?? null,
      },
      id,
    );
  }
}

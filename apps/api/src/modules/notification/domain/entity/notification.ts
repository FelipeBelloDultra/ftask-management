import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface NotificationProps {
  title: string;
  content: string;
  readAt: Date | null;
  wasRead: boolean;
  createdAt: Date;
  recipientId: UniqueEntityID;
}

export class Notification extends Entity<NotificationProps> {
  public get title() {
    return this.props.title;
  }

  public get content() {
    return this.props.content;
  }

  public get readAt() {
    return this.props.readAt;
  }

  public get wasRead() {
    return this.props.wasRead;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get recipientId() {
    return this.props.recipientId;
  }

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

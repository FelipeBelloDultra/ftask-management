import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";

export interface NotificationMetadataProps {
  notificationId: UniqueEntityID;
  key: string;
  value: string;
}

export class NotificationMetadata extends Entity<NotificationMetadataProps> {
  public get notificationId() {
    return this.props.notificationId;
  }

  public get key() {
    return this.props.key;
  }

  public get value() {
    return this.props.value;
  }

  public static create(props: NotificationMetadataProps, id?: UniqueEntityID) {
    return new NotificationMetadata(props, id);
  }
}

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ValueObject } from "@/core/entity/value-object";

import { NotificationMetadata } from "../notification-metadata";

export interface NotificationDetailProps {
  notificationId: UniqueEntityID;
  recipientId: UniqueEntityID;
  title: string;
  content: string;
  readAt: Date | null;
  createdAt: Date;
  additionalInfos: Array<NotificationMetadata>;
}

export class NotificationDetail extends ValueObject<NotificationDetailProps> {
  public get notificationId() {
    return this.props.notificationId;
  }

  public get recipientId() {
    return this.props.recipientId;
  }

  public get title() {
    return this.props.title;
  }

  public get content() {
    return this.props.content;
  }

  public get readAt() {
    return this.props.readAt;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get additionalInfos() {
    return this.props.additionalInfos;
  }

  public static create(props: NotificationDetailProps) {
    return new NotificationDetail(props);
  }
}

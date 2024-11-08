import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ValueObject } from "@/core/entity/value-object";
import { Account } from "@/modules/account/domain/entity/account";

import { Project } from "../project";

import { DueDate } from "./due-date";
import { InvitationStatus } from "./invitation-status";

interface InviteDetailProps {
  id: UniqueEntityID;
  project: Project;
  member: Account;
  expirationDate: DueDate;
  status: InvitationStatus;
  createdAt: Date;
}

export class InviteDetail extends ValueObject<InviteDetailProps> {
  public get id() {
    return this.props.id;
  }

  public get project() {
    return this.props.project;
  }

  public get member() {
    return this.props.member;
  }

  public get expirationDate() {
    return this.props.expirationDate;
  }

  public get status() {
    return this.props.status;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public static create(props: InviteDetailProps) {
    return new InviteDetail(props);
  }
}

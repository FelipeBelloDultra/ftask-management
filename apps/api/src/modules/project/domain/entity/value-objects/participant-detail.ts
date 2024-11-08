import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ValueObject } from "@/core/entity/value-object";
import { Account } from "@/modules/account/domain/entity/account";

import { Project } from "../project";

import { ParticipantRole } from "./participant-role";

interface ParticipantDetailProps {
  id: UniqueEntityID;
  account: Account;
  project: Project;
  role: ParticipantRole;
}

export class ParticipantDetail extends ValueObject<ParticipantDetailProps> {
  public get id() {
    return this.props.id;
  }

  public get account() {
    return this.props.account;
  }

  public get project() {
    return this.props.project;
  }

  public get role() {
    return this.props.role;
  }

  public static create(props: ParticipantDetailProps): ParticipantDetail {
    return new ParticipantDetail(props);
  }
}

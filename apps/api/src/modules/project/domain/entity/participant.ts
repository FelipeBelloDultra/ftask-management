import { Entity } from "@/core/entity/entity";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Optional } from "@/core/types/optional";

import { ParticipantRole, ParticipantRoleValues } from "./value-objects/participant-role";

export interface ParticipantProps {
  accountId: UniqueEntityID;
  projectId: UniqueEntityID;
  role: ParticipantRole;
}

export class Participant extends Entity<ParticipantProps> {
  public get accountId() {
    return this.props.accountId;
  }

  public get projectId() {
    return this.props.projectId;
  }

  public get role() {
    return this.props.role;
  }

  public static create(props: Optional<ParticipantProps, "role">, id?: UniqueEntityID) {
    return new Participant(
      {
        role: props.role ?? ParticipantRole.create(ParticipantRoleValues.Member),
        ...props,
      },
      id,
    );
  }
}

import { UniqueEntityID } from "@/core/entity/unique-entity-id";

import { Participant } from "../../domain/entity/participant";
import { ParticipantDetail } from "../../domain/entity/value-objects/participant-detail";

export interface ParticipantRepository {
  create(participant: Participant): Promise<void>;
  findByProjectIdAndAccountId(projectId: UniqueEntityID, accountId: UniqueEntityID): Promise<Participant | null>;
  findDetailedByProjectIdAndAccountId(
    projectId: UniqueEntityID,
    accountId: UniqueEntityID,
  ): Promise<ParticipantDetail | null>;
}

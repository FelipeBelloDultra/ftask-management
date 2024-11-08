import { Participant } from "../../domain/entity/participant";

export interface ParticipantRepository {
  create(participant: Participant): Promise<void>;
}

import { ParticipantRepository } from "@/modules/project/application/repositories/participant.repository";
import { Participant } from "@/modules/project/domain/entity/participant";

export class InMemoryParticipantR implements ParticipantRepository {
  public readonly participants: Participant[] = [];

  public async create(participant: Participant): Promise<void> {
    this.participants.push(participant);
  }
}

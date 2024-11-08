import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ParticipantRepository } from "@/modules/project/application/repositories/participant.repository";
import { Participant } from "@/modules/project/domain/entity/participant";
import { ParticipantDetail } from "@/modules/project/domain/entity/value-objects/participant-detail";

import { InMemoryAccountRepository } from "./in-memory-account.repository";
import { InMemoryProjectRepository } from "./in-memory-project.repository";

export class InMemoryParticipantR implements ParticipantRepository {
  public readonly participants: Participant[] = [];

  public constructor(
    private readonly projectRepository: InMemoryProjectRepository,
    private readonly accountRepository: InMemoryAccountRepository,
  ) {}

  public async create(participant: Participant): Promise<void> {
    this.participants.push(participant);
  }

  public async findByProjectIdAndAccountId(
    projectId: UniqueEntityID,
    accountId: UniqueEntityID,
  ): Promise<Participant | null> {
    const participant = this.participants.find((p) => p.accountId.equals(accountId) && p.projectId.equals(projectId));

    return participant || null;
  }

  public async findDetailedByProjectIdAndAccountId(
    projectId: UniqueEntityID,
    accountId: UniqueEntityID,
  ): Promise<ParticipantDetail | null> {
    const participant = await this.findByProjectIdAndAccountId(projectId, accountId);

    if (!participant) {
      return null;
    }

    const accountEntity = await this.accountRepository.findById(participant.accountId);
    const projectEntity = await this.projectRepository.findById(participant.projectId);

    if (!accountEntity || !projectEntity) {
      return null;
    }

    return ParticipantDetail.create({
      id: participant.id,
      account: accountEntity,
      project: projectEntity,
      role: participant.role,
    });
  }
}

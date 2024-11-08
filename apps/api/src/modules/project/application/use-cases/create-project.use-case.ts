import { inject, injectable } from "tsyringe";

import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { AccountRepository } from "@/modules/account/application/repositories/account.repository";
import { ProjectRepository } from "@/modules/project/application/repositories/project.repository";
import { Project } from "@/modules/project/domain/entity/project";
import { DueDate } from "@/modules/project/domain/entity/value-objects/due-date";

import { Participant } from "../../domain/entity/participant";
import { ParticipantRole } from "../../domain/entity/value-objects/participant-role";
import { CreateProjectDto } from "../dtos/create-project-dto";
import { ParticipantRepository } from "../repositories/participant.repository";

import { AccountNotFoundError } from "./errors/account-not-found.error";
import { DuplicatedProjectSlugError } from "./errors/duplicated-project-slug.error";

type OnError = DuplicatedProjectSlugError | AccountNotFoundError;
type OnSuccess = { project: Project };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class CreateProjectUseCase {
  public constructor(
    @inject("ProjectRepository")
    private readonly projectRepository: ProjectRepository,
    @inject("AccountRepository")
    private readonly accountRepository: AccountRepository,
    @inject("ParticipantRepository")
    private readonly participantRepository: ParticipantRepository,
  ) {}

  public async execute(input: CreateProjectDto): Promise<Output> {
    const accountId = UniqueEntityID.create(input.ownerAccountId);

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return left(new AccountNotFoundError());
    }

    const project = Project.create({
      name: input.name,
      description: input.description,
      dueDate: input.dueDate ? DueDate.create(input.dueDate) : null,
      ownerId: accountId,
    });

    const projectBySlug = await this.projectRepository.findBySlug(project.slug);
    if (projectBySlug) {
      return left(new DuplicatedProjectSlugError());
    }

    await this.projectRepository.create(project);

    const projectOwner = Participant.create({
      accountId: account.id,
      projectId: project.id,
      role: ParticipantRole.createAsOwner(),
    });
    await this.participantRepository.create(projectOwner);

    return right({ project });
  }
}

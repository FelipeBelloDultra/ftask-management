import { AccountRepository } from "~/account/application/repositories/account.repository";
import { Either, left, right } from "~/core/either";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { ProjectRepository } from "~/project/application/repositories/project.repository";
import { Project } from "~/project/domain/entity/project";
import { DueDate } from "~/project/domain/entity/value-objects/due-date";

import { AccountNotFoundError } from "./errors/account-not-found.error";
import { DuplicatedProjectSlugError } from "./errors/duplicated-project-slug.error";

type Input = {
  ownerAccountId: string;
  name: string;
  description: string | null;
  dueDate: Date | null;
};
type OnError = DuplicatedProjectSlugError | AccountNotFoundError;
type OnSuccess = { project: Project };
type Output = Either<OnError, OnSuccess>;

export class CreateProjectUseCase {
  public constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
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

    const projectBySlug = await this.projectRepository.findBySlug(project.values.slug);
    if (projectBySlug) {
      return left(new DuplicatedProjectSlugError());
    }

    await this.projectRepository.create(project);

    return right({ project });
  }
}

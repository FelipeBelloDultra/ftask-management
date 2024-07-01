import { AccountRepository } from "~/account/application/repositories/account.repository";
import { OwnerRepository } from "~/account/application/repositories/owner.repository";
import { Owner } from "~/account/domain/entity/owner";
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
    private readonly ownerRepository: OwnerRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const accountId = UniqueEntityID.create(input.ownerAccountId);

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return left(new AccountNotFoundError());
    }

    const owner = await this.ownerRepository.findByAccountId(accountId);
    let ownerId = owner?.id;
    if (!owner) {
      const owner = Owner.create({
        accountEmail: account.values.email,
        accountId: account.id,
        accountName: account.values.name,
      });

      await this.ownerRepository.create(owner);

      ownerId = owner.id;
    }

    const project = Project.create({
      name: input.name,
      description: input.description,
      dueDate: input.dueDate ? DueDate.create(input.dueDate) : null,
      ownerId: ownerId!,
    });

    const projectBySlug = await this.projectRepository.findBySlug(project.values.slug);
    if (projectBySlug) {
      return left(new DuplicatedProjectSlugError());
    }

    await this.projectRepository.create(project);

    return right({ project });
  }
}
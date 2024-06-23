import { Either, left, right } from "~/core/either";
import { Project } from "~/modules/project/domain/entity/project";
import { DueDate } from "~/modules/project/domain/entity/value-objects/due-date";
import { Owner } from "~/modules/project/domain/entity/owner";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { AccountRepository } from "~/modules/account/application/repositories/account.repository";

import { ProjectRepository } from "../repositories/project.repository";
import { OwnerRepository } from "../repositories/owner.repository";

import { DuplicatedProjectSlugError } from "./errors/duplicated-project-slug.error";
import { AccountNotFoundError } from "./errors/account-not-found.error";

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

import { Either, left, right } from "~/core/either";
import { Project } from "~/modules/project/domain/entity/project";
import { DueDate } from "~/modules/project/domain/entity/value-objects/due-date";
import { Owner } from "~/modules/project/domain/entity/owner";

import { ProjectRepository } from "../repositories/project.repository";
import { AccountRepository } from "../repositories/account.repository";
import { OwnerRepository } from "../repositories/owner.repository";

import { DuplicatedProjectSlug } from "./errors/duplicated-project-slug.error";
import { AccountNotFound } from "./errors/account-not-found.error";

type Input = {
  accountId: string;
  name: string;
  description: string | null;
  dueDate: Date | null;
};
type Output = Either<DuplicatedProjectSlug | AccountNotFound, { project: Project }>;

export class CreateProjectUseCase {
  public constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly accountRepository: AccountRepository,
    private readonly ownerRepository: OwnerRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.findById(input.accountId);
    if (!account) {
      return left(new AccountNotFound());
    }

    const owner = await this.ownerRepository.findByAccountId(input.accountId);
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
      return left(new DuplicatedProjectSlug());
    }

    await this.projectRepository.create(project);

    return right({ project });
  }
}

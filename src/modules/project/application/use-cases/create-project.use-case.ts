import { Either, left, right } from "~/core/either";
import { Project } from "~/modules/project/domain/entity/project";
import { DueDate } from "~/modules/project/domain/entity/value-objects/due-date";
import { Owner } from "~/modules/project/domain/entity/owner";

import { ProjectRepository } from "../repositories/project.repository";
import { UserRepository } from "../repositories/user.repository";
import { OwnerRepository } from "../repositories/owner.repository";

import { DuplicatedProjectSlug } from "./errors/duplicated-project-slug.error";
import { AccountNotFound } from "./errors/account-not-found.error";

type Input = {
  userId: string;
  name: string;
  description: string | null;
  dueDate: Date | null;
};
type Output = Either<DuplicatedProjectSlug | AccountNotFound, { project: Project }>;

export class CreateProjectUseCase {
  public constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    private readonly ownerRepository: OwnerRepository,
  ) {}

  public async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      return left(new AccountNotFound());
    }

    const owner = await this.ownerRepository.findByUserId(input.userId);
    let ownerId = owner?.id;
    if (!owner) {
      const owner = Owner.create({
        userEmail: user.values.email,
        userId: user.id,
        userName: user.values.name,
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

import { inject, injectable } from "tsyringe";

import { Either, right } from "@/core/either";
import { Pagination } from "@/core/entity/pagination";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ProjectRepository } from "@/modules/project/application/repositories/project.repository";
import { Project } from "@/modules/project/domain/entity/project";

import { FetchProjectsByAccountDto } from "../dtos/fetch-projects-by-account-dto";

type OnError = never;
type OnSuccess = { projects: Project[]; pagination: Pagination; total: number };
type Output = Either<OnError, OnSuccess>;

@injectable()
export class FetchProjectsByAccountUseCase {
  public constructor(
    @inject("ProjectRepository")
    private readonly projectRepository: ProjectRepository,
  ) {}

  public async execute(input: FetchProjectsByAccountDto): Promise<Output> {
    const ownerId = UniqueEntityID.create(input.ownerId);

    const pagination = Pagination.create({
      limit: input.limit,
      page: input.page,
    });
    const { projects, total } = await this.projectRepository.fetchManyByOwnerId(ownerId, pagination);

    return right({
      pagination,
      projects,
      total,
    });
  }
}

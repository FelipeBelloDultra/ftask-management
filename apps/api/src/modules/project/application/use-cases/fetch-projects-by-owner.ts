import { inject } from "tsyringe";

import { Either } from "@/core/either";
import { ProjectRepository } from "@/modules/project/application/repositories/project.repository";
import { Project } from "@/modules/project/domain/entity/project";

import { AccountNotFoundError } from "./errors/account-not-found.error";

type Input = {
  ownerId: string;
  page: number;
  limit: number;
};
type OnError = AccountNotFoundError;
type OnSuccess = { projects: Project[]; total: number };
type Output = Either<OnError, OnSuccess>;

export class FetchProjectsByOwner {
  public constructor(
    @inject("ProjectRepository")
    private readonly projectRepository: ProjectRepository,
  ) {}

  public async execute(_: Input): Promise<Output> {
    throw new Error("not implemented");
  }
}

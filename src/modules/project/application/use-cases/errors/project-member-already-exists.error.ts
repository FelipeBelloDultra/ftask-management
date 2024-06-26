import type { UseCaseError } from "~/core/errors/use-case.error";

export class ProjectMemberAlreadyExistsError extends Error implements UseCaseError {
  public constructor() {
    super("Project member already exists");
    this.name = ProjectMemberAlreadyExistsError.name;
  }
}

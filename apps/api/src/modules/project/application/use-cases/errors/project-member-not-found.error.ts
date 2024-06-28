import { UseCaseError } from "~/core/errors/use-case.error";

export class ProjectMemberNotFoundError extends Error implements UseCaseError {
  public constructor() {
    super("Project member not found");
    this.name = ProjectMemberNotFoundError.name;
  }
}

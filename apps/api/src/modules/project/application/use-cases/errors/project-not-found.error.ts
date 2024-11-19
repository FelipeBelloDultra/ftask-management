import { UseCaseError } from "@/core/errors/use-case.error";

export class ProjectNotFoundError extends Error implements UseCaseError {
  public constructor() {
    super("Project not found");
    this.name = ProjectNotFoundError.name;
  }
}

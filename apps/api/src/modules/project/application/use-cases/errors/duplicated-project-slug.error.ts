import type { UseCaseError } from "~/core/errors/use-case.error";

export class DuplicatedProjectSlugError extends Error implements UseCaseError {
  public constructor() {
    super("Duplicated project slug");
    this.name = DuplicatedProjectSlugError.name;
  }
}

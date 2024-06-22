import { UseCaseError } from "~/core/errors/use-case.error";

export class DuplicatedProjectSlug extends Error implements UseCaseError {
  public constructor() {
    super("Duplicated project slug");
    this.name = DuplicatedProjectSlug.name;
  }
}

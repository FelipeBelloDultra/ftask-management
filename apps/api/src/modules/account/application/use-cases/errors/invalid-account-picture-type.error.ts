import { UseCaseError } from "@/core/errors/use-case.error";

export class InvalidAccountPictureTypeError extends Error implements UseCaseError {
  public constructor(fileType: string) {
    super(`Invalid attachment type: ${fileType}`);
    this.name = InvalidAccountPictureTypeError.name;
  }
}

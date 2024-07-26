import { UseCaseError } from "@/core/errors/use-case.error";

export class MemberNotFoundError extends Error implements UseCaseError {
  public constructor() {
    super("Member not found");
    this.name = MemberNotFoundError.name;
  }
}

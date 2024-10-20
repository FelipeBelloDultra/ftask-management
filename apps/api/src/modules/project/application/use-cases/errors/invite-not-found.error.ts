import { UseCaseError } from "@/core/errors/use-case.error";

export class InviteNotFoundError extends Error implements UseCaseError {
  public constructor() {
    super("Invite not found");
    this.name = InviteNotFoundError.name;
  }
}

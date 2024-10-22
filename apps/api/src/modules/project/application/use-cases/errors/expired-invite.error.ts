import { UseCaseError } from "@/core/errors/use-case.error";

export class ExpiredInviteError extends Error implements UseCaseError {
  public constructor() {
    super("Invite has expired");
    this.name = ExpiredInviteError.name;
  }
}

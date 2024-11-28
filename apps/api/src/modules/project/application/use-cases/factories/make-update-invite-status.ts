import { container } from "tsyringe";

import { UpdateInviteStatusUseCase } from "../update-invite-status.use-case";

export function makeUpdateInviteStatus() {
  const updateInviteStatus = container.resolve(UpdateInviteStatusUseCase);

  return updateInviteStatus;
}

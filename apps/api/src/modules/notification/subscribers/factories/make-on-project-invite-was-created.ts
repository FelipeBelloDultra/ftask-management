import { container } from "tsyringe";

import { OnProjectInviteWasCreated } from "../on-project-invite-was-created";

export function makeOnProjectInviteWasCreated() {
  const onProjectInviteWasCreated = container.resolve(OnProjectInviteWasCreated);

  return onProjectInviteWasCreated;
}

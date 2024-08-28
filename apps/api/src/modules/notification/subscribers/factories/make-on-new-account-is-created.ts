import { container } from "tsyringe";

import { OnNewAccountIsCreated } from "../on-new-account-is-created";

export function makeOnNewAccountIsCreated() {
  const onNewAccountIsCreated = container.resolve(OnNewAccountIsCreated);

  return onNewAccountIsCreated;
}

import { container } from "tsyringe";

import { EnsureAuthenticatedMiddleware } from "../ensure-authenticated.middleware";

export function makeEnsureAuthenticated() {
  const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticatedMiddleware);

  return ensureAuthenticatedMiddleware;
}

import { container } from "tsyringe";

import { EnsureAuthenticatedMiddleware } from "../ensure-authenticated.middleware";

function makeEnsureAuthenticated() {
  const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticatedMiddleware);

  return ensureAuthenticatedMiddleware;
}

export const ensureAuthenticatedMiddleware = makeEnsureAuthenticated();

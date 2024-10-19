import { container } from "tsyringe";

import { FetchProjectsByAccountUseCase } from "../fetch-projects-by-account.use-case";

export function makeFetchProjectsByAccount() {
  const fetchProjectsByAccount = container.resolve(FetchProjectsByAccountUseCase);

  return fetchProjectsByAccount;
}
